angular.module('app')

.factory('blogService', function($http, $sce, config, Upload) {

    return {
        getData: {
            stories: stories,
/*
            blog: blogPosts,
*/
            postById: post,
            comments: comments,
            mystories: byUser,
            page: page
        },
        postData: {
            comment: postComment,
            newStory: postStory,
            updateStory: updateStory,
            deleteStory: deleteStory,
            publishStory: publishStory,
            deleteImage: deleteImage,
            uploadImage: uploadImage
        }
    };


    //FIRST GETTERS
    function stories() {
        //return getData('posts?filter[category_name]=histoire');
        var dt = getData('cehavre/v1/stories');
        return dt;
    }
/*
    function blogPosts() {
        return getData('wp/v2/posts?filter[category_name]=blog');
    }
*/
    function post(id) {
        if(/^\d+$/.test(id)){
        return getData('wp/v2/posts/' + id);
        } else {
        return getData('wp/v2/posts?filter[name]='+id);
        }
    }
    function comments(id) {
        return getData('wp/v2/comments?post='+id);
    }
    function byUser(usrId) {
        return getData('cehavre/v1/user?id='+usrId);
    }
    function page(){
        return getData('wp/v2/pages');
    }

    function getData(url) {
        return $http
            .get(config.API_URL + url, { cache: false })
            .then(function(response) {
                if (response.data instanceof Array) {
                    var items = response.data.map(function(item) {
                        return decorateResult(item);
                    });
                    return items;
                } else {
                    return decorateResult(response.data);
                }
            });
    }
    function decorateResult(result) {
        if(result.hasOwnProperty('excerpt')){
            if(result.excerpt.hasOwnProperty('rendered')){
                result.excerpt = result.excerpt.rendered;
            }
            result.excerpt = $sce.trustAsHtml(result.excerpt);
        }
        //result.date = Date.parse(result.date);
        if(result.content.hasOwnProperty('rendered')){
            result.content = result.content.rendered;
        }
        if(result.slug === ''){
            result.slug = result.title.toLowerCase().trim().replace(/\s/g, '-');
        }

        result.content = $sce.trustAsHtml(result.content);
        return result;
    }

    // THEN POSTERS

    function postComment(comment){
        return postData('wp/v2/comments', comment);
    }
    function postStory(story){
        return postData('cehavre/v1/new', JSON.stringify(story));
    }
    function publishStory(story){
        return postData('cehavre/v1/publish?id=' + story.ID);
    }
    function updateStory(story){
        var st = {
            ID: story.ID,
            title: story.title,
            localisation: story.localisation,
            tags: story.tags
        };
        if(typeof story.content == 'object'){
            st.content = story.content.toString();
        } else if(typeof story.content == 'string'){
            st.content = story.content;
        }
        return postData('cehavre/v1/update', JSON.stringify(st));
    }
    function deleteStory(id){
        return $http
        .delete(config.API_URL + 'wp/v2/posts/' + id + '?force=true')
        .then(function(response){
            //DO STH
        });
    }
    function uploadImage(file, postId){
        return uploadImg('cehavre/v1/uploadImage?id=' + postId, file);
    }
    function deleteImage(id){
        return postData('cehavre/v1/deleteImage?id='+id);
    }

    function postData(url, data){
        return $http({
            method: 'POST',
            url: config.API_URL + url,
            data: data
        })
        .then(function(response){
            return response;
        });
    }

    //this function relies on external module to handle file upload
    function uploadImg(url, data){
        return Upload.upload({
            url: config.API_URL + url,
            data: {
                file: data
            }
        }).then(function(response){
            return response;
        });
    }

});
