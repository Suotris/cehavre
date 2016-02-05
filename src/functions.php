<?php
register_nav_menus( array(
        'primary' => __( 'Primary', 'karine' ),
    ) );

//enqueue scripts

add_action( 'wp_enqueue_scripts', 'pr_scripts_styles' );

//Dequeue core scripts

/*if(!is_admin()){
    remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
    remove_action( 'wp_print_styles', 'print_emoji_styles' );
    wp_deregister_style( 'dashicons' );
}*/

//restrict dashboard access

function custom_remove_no_admin_access(){
    if ( ! defined( 'DOING_AJAX' ) && ! current_user_can( 'manage_options' ) ) {
        wp_redirect( home_url() );
        die();
    }
}
add_action( 'admin_init', 'custom_remove_no_admin_access', 1 );

//produce nonce for rest requests
//wp_register_script()

function make_nonce() {
    // ...
    wp_localize_script(
        'make_nonce',
        'localized',
        array(
            'nonce' => wp_create_nonce( 'wp_rest' )
            )
    );
}
add_action( 'wp_enqueue_scripts', 'make_nonce' );

//remove admin bar annoyance
add_action('get_header', 'remove_admin_login_header');
function remove_admin_login_header() {
    remove_action('wp_head', '_admin_bar_bump_cb');
};

//add support for featured images and custom image sizes
add_theme_support( 'post-thumbnails' );
if ( function_exists( 'add_image_size' ) ) {
    add_image_size('m-featured', 546, 307, true);
    add_image_size('l-featured', 887, 499, true);
};

//custom redirections for login/logup
function auto_login_new_user( $user_id ) {
    wp_set_current_user( $user_id );
    wp_set_auth_cookie( $user_id);

    echo 'current user: '. wp_get_current_user()->user_login;

    wp_redirect(home_url().'/logup?newlog=true');
}
add_action( 'user_register', 'auto_login_new_user' );

//SMTP server
/**
 * This function will connect wp_mail to your authenticated
 * SMTP server. This improves reliability of wp_mail, and
 * avoids many potential problems.
 *
 * Author:     Chad Butler
 * Author URI: http://butlerblog.com
 *
 * For more information and instructions, see:
 * http://b.utler.co/Y3
 */



/******* Custom signin - signup functions *******/

add_action('wp_ajax_signin', 'custom_signin');

function custom_signin($_post){
    echo $_post['data'];
};
