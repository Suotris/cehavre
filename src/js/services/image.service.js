angular.module('app')

.service('img', function(){

    return image;

    function image(url){
        var stem = url.substring(0, url.length - 4);
        var    s = stem + '-546x307.jpg',
            m = stem + '-887x499.jpg';

        return {
            s: s,
            m: m
        };
    }
});
