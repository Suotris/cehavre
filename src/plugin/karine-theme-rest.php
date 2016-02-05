<?php

/*
  Plugin Name: CeHavre REST
  Description: API modifications for CeHavre theme
  Version: 1.0
  Author: Tristan Hamel
  Author URI: http://tristanhamel.eu
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) exit;

//////////////////////////////////////////////

//add a custom endpoint cehavre/new
//used to create a new story
add_action('rest_api_init', function(){
    register_rest_route('cehavre/v1', '/new/', array(
        'methods' => 'POST',
        'callback' => 'create_story',
        'args' => array(
            'title' => array(
                'validate_callback' => 'is_valid_title'
            ),
            'content' => array(
                'validate_callback' => 'is_valid_content'
            ),
            'localisation' => array(
                'validate_callback' => 'is_valid_localisation'
            ),
            'author' => array(
                'required' => true,
                'validate_callback' => 'is_numeric'
            )
        ),
        'permission_callback' => function () {
            return current_user_can( 'edit_posts' );
        }
    ));
});


//validation functions for arguments
function is_valid_localisation($loc){
    if(!array_key_exists('address', $loc) ||
       !array_key_exists('lat', $loc) ||
       !array_key_exists('lng', $loc)){
        return false;
    };
    if(!is_string($loc['address'])){
        return false;
    };
    return true;
};

function is_valid_title($val){
    return is_string($val);
};

function is_valid_content($val){
    return is_string($val);
};

//controller
function create_story($param){

    //the new post object
    $post = array(
        'post_status' => 'draft',
        'post_author' => $param['author'],
        'post_category' => array((int) get_cat_id('histoire'))
    );

    if($param['content']){
        $post['post_content'] = $param['content'];
    }

    if($param['title']){
        $post['post_title'] = wp_strip_all_tags($param['title']);
    }

    //insert the post in db
    $post_id = wp_insert_post( $post, true );

    //updates localisation custom field
    if($param['localisation']){
        update_field( "field_5654eb30ea15e", $param['localisation'], $post_id );
    }

    if($param['tags']){
        wp_set_post_tags($post_id, $param['tags']);
    }

    return formatted_post(get_post($post_id));
};

//////////////////////////////////////////////

//add a custom endpoint cehavre/update
//used to update existing story. The regular endpoint does not
//support updating metadata;

add_action('rest_api_init', function(){
    register_rest_route('cehavre/v1', '/update/', array(
        'methods' => 'POST',
        'callback' => 'update_story',
//Validation callbacks shared with new story.
//No need of updating author. None of the args are required.
        'args' => array(
            'ID' => array(
                'required' => true,
                'validate_callback' => 'is_numeric',
            ),
            'title' => array(
                'validate_callback' => 'is_valid_title'
            ),
            'content' => array(
                'validate_callback' => 'is_valid_content'
            ),
            'localisation' => array(
                'validate_callback' => 'is_valid_localisation'
            )
        ),
        'permission_callback' => function () {
            return current_user_can( 'edit_posts' );
        }
    ));
});


//controller
function update_story($param){

    //the new post object
    $post = array();

    if($param['content']){
        $post['post_content'] = $param['content'];
    };
    if($param['title']){
        $post['post_title'] = $param['title'];
    };
    if(count($post) > 0){
        $post['ID'] = $param['ID'];
        $post_id = wp_update_post( $post, true );
    };

    if($param['localisation']){
        update_field( "field_5654eb30ea15e", $param['localisation'], $param['ID']);
    };

    if($param['tags']){
        wp_set_post_tags($param['ID'], $param['tags']);
    }

    return formatted_post(get_post($post_id));
};

//////////////////////////////////////////////

//add a custom endpoint cehavre/stories
//used to get ALL the stories in nice format
add_action('rest_api_init', function(){
    register_rest_route( 'cehavre/v1', '/stories/', array(
        'methods' => 'GET',
        'callback' => 'get_stories'
    ));
});

//controller
function get_stories(){
    $all_stories = get_posts( array(
        'numberposts' => -1,
        'category_name' => 'histoire'
    ));

    $result = [];

    if (empty($all_stories)){
        return new WP_Error( 'bad_request', 'Nothing found', array( 'status' => 404 ) );
    } else {
        foreach($all_stories as $story){
            $result[] = formatted_post($story);
        };
    };

    return $result;
};

/////////////////////////////////////////////

//add a custom endpoint cehavre/user?id=[ID]
//used to get stories from 1 user. Either published or draft.
add_action('rest_api_init', function(){
    register_rest_route( 'cehavre/v1', '/user/', array(
        'methods' => 'GET',
        'callback' => 'get_user_stories',
        'args' => array(
            'id' => array(
                'required' => true,
                'validate_callback' => 'is_numeric'
            )
        ),
        'permission_callback' => function () {
            return current_user_can( 'edit_posts' );
        }
    ));
});

//controller
function get_user_stories($param){
    $all_stories = get_posts( array(
        'numberposts' => -1,
        'category_name' => 'histoire',
        'post_status' => array('draft', 'publish', 'auto-draft', 'pending'),
        'author' => $param['id']
    ));
    $result = [];

    if (empty($all_stories) || wp_get_current_user()->data->ID != $param['id']){
        //return new WP_Error( 'bad_request', 'Nothing found', array( 'status' => 404 ) );
        $result = [];
    } else {
        foreach($all_stories as $story){
            $result[] = formatted_post($story);
        };
    };

    return $result;

};

/////////////////////////////////////////////

//add a custom endpoint cehavre/publish?id=[id]
//used to change the status of the post from draft to pending
add_action('rest_api_init', function(){
    register_rest_route( 'cehavre/v1', '/publish/', array(
        'methods' => 'POST',
        'callback' => 'publish_story',
        'args' => array(
            'id' => array(
                'required' => true,
                'validate_callback' => 'is_numeric'
            )
        ),
        'permission_callback' => function () {
            return current_user_can( 'edit_posts' );
        }
    ));
});

function publish_story($param){
    $id = $param['id'];
    $post = array(
        'ID' => $id,
        'post_status' => 'pending'
    );

    wp_update_post( $post );
}

/////////////////////////////////////////////

//add a custom endpoint cehavre/uploadImage?id=[id]
add_action('rest_api_init', function(){
    register_rest_route( 'cehavre/v1', '/uploadImage/', array(
        'methods' => 'POST',
        'callback' => 'upload_image',
        'args' => array(
            'id' => array(
                'required' => true,
                'validate_callback' => 'is_numeric'
            )
        ),
        'permission_callback' => function ($param) {
            return current_user_can( 'edit_posts');
        }
    ));
});

function upload_image($param){
    $file = $param->get_file_params()['file'];
    $name = $file['name'];

    //first we save the file in the upload folder
    $upload = wp_upload_bits($name, null, file_get_contents($file['tmp_name']));

    //second, we insert the attachment in the media library
    $filename =  $upload['file'];
    $filetype = wp_check_filetype( basename( $filename ), null );
    $wp_upload_dir = wp_upload_dir();
    $parent_post_id = $param['id'];
    $attachment = array(
        'guid'           => $wp_upload_dir['url'] . '/' . basename( $filename ),
        'post_mime_type' => $filetype['type'],
        'post_title'     => preg_replace( '/\.[^.]+$/', '', basename( $filename ) ),
        'post_content'   => '',
        'post_status'    => 'inherit'
    );

    $attach_id = wp_insert_attachment( $attachment, $filename, $parent_post_id );

    //third, we generate metadata (creates various pic sizes, etc)
    require_once( ABSPATH . 'wp-admin/includes/image.php');
    $generate = wp_generate_attachment_metadata($attach_id, $filename);
    wp_update_attachment_metadata( $attach_id,  $generate );

    //last, we update the post and send the http response.
    set_post_thumbnail( $parent_post_id, $attach_id );

    return formatted_post(get_post($parent_post_id));

/*  We should use  media_handle_upload( 'file', $param['id'] );
    but this sends a 500 error. Somehow it does not grab the file although
    calling $_FILES['file'] shows it is there!
*/
}

/////////////////////////////////////////////

//add a custom endpoint cehavre/deleteImage?id=[id]
add_action('rest_api_init', function(){
    register_rest_route( 'cehavre/v1', '/deleteImage/', array(
        'methods' => 'POST',
        'callback' => 'delete_image',
        'args' => array(
            'id' => array(
                'required' => true,
                'validate_callback' => 'is_numeric'
            )
        ),
        'permission_callback' => function ($param) {
            return current_user_can( 'edit_posts', $param['id']);
        }
    ));
});

function delete_image($param){
    $id = $param['id'];
    $meta = wp_get_attachment_metadata($id);

    //clean DB and delete main file
    $return = wp_delete_attachment($id, true);

    //delete all associated files
    $path = wp_upload_dir()['basedir'].'/'.substr($meta['file'], 0, strrpos($meta['file'], '/')+1);
    $return = array(true);
    foreach($meta['sizes'] as $size){
        $r = unlink($path.$size['file']);
    };
    return $meta;
}

/////////////////////////////////////////////

//custom function to generate excerpt
function excerpt($content){
    $max_length = 55;

    $content = apply_filters('the_excerpt', $content);
    $content = $line_breaks ?
        strip_tags(strip_shortcodes($content), '<p><br>') :
        strip_tags(strip_shortcodes($content)); //Strips tags and images

    $words = explode(' ', $content);
    if(count($words) > $max_length){
        $words = array_slice($words, 0, $max_length);
        array_push($words, '…');
        $content = implode(' ', $words);
        $content = $line_breaks ? $content . '</p>' : $content;
    };
    $content = trim($content);
    return $content;
}

//custom function to format post object
function formatted_post($story){
    $author = get_userdata((int) $story->post_author);
    $author_data = $author->data;
    $id = $story->ID;
    $excerpt = excerpt($story->post_content);
    $meta = get_post_meta($id, 'localisation')[0];
    $sound = get_post_meta($id, 'lien_soundcloud')[0];
    $tags = wp_get_post_tags($id, array('fields'=>'names'));
    $image_id = get_post_thumbnail_id($id);
    $image_url = wp_get_attachment_url($image_id);
    $s;
    if($story->post_name){$s = $story->post_name;}
    else {$s = sanitize_title($story->post_title);}

    return array(
        'ID' => $id,
        'title' => $story->post_title,
        'slug' => $s,
        'content' => $story->post_content,
        'excerpt' => $excerpt,
        'date' => date_i18n( get_option( 'date_format' ), strtotime($story-> post_date)),
        'comment_count' => $story->comment_count,
        'author' => array(
            'id' => $author_data->ID,
            'name'=> $author_data->user_nicename,
            'display_name'=> $author_data->display_name
        ),
        'modified'=>date_i18n( get_option( 'date_format' ), strtotime($story-> post_modified)),
        'comment_status'=>$story->comment_status,
        'post_status'=>$story->post_status,
        'localisation'=> $meta,
        'sound'=> $sound,
        'tags'=> $tags,
        'image'=> array(
            'id'=> $image_id,
            'url'=> $image_url
        )
    );
};
