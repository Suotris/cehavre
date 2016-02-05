
//NOTE: to simplify gulp task, this module is temporarily put here.
angular.module('wpAngularAuth', []);

angular.module('app', ['ngAnimate', 'ngRoute', 'ngSanitize', 'mm.foundation', 'ngMap', '720kb.socialshare', 'duScroll', 'ngFileUpload', 'templates', 'wpAngularAuth'])

.config(function($routeProvider, $locationProvider, $httpProvider, config){

// ROUTING //

    $routeProvider
    .when('/', {
        templateUrl: 'home.tpl.html',
        controller: 'mainPageController',
        resolve: {
            ctr: function(current, $route, authenticate){
                if($route.current.params.loginerror){
                    authenticate.signin();
                }
                if(current.get.story()){
                    current.set.story(null);
                }
            },

            markers: function(current, mapProvider, coordinateService){
                return current.get.stories().then(function(stories){
                    return mapProvider.newMarkers(
                        coordinateService.collection(
                            stories
                        )
                    );
                });
            }
        }
    })
/*    .when('/blog', {
        templateUrl: 'blog.tpl.html',
        controller: 'blogController',
    })
    .when('/blog/:post_slug', {
        templateUrl: 'blog-post.tpl.html',
        controller: 'blogPostController',
        resolve: {crt: function($route, blogPosts){
            return blogPosts.getOne($route.current.params.post_slug);
        }}
    })*/
    .when('/about', {
        templateUrl: 'about.tpl.html',
        controller: 'aboutController'
    })
    .when('/post', {
        templateUrl:  'post.tpl.html',
        controller: 'postController'
    })
    .when('/post/:post_slug', {
        templateUrl:  'post.tpl.html',
        controller: 'postController',
        resolve: {
            crt: function($route, current){
                return current.get.stories().then(function(st){
                    current.set.story($route.current.params.post_slug);
                    return current.get.story();
                });
            }
        }
    })
    .when('/my-stories', {
        templateUrl: 'my-stories.tpl.html',
        controller: 'myStoriesController',
        resolve:{
            mystories: function(current){
                return current.set.mystories().then(function(stories){
                    return stories;
                });
            }
        }
    })
    .when('/my-profile', {
        templateUrl: 'my-profile.html',
        controller: 'myProfileController',
        resolve: {
            redir: function($rootScope, $location){
                if(!$rootScope.user){
                    return $location.url('/');
                }
            }
        }
    })
    .when('/terms', {
        templateUrl: 'terms.tpl.html',
        controller: 'aboutController'
    })
    .when('/edit-story/:story', {
        templateUrl: 'edit-story.tpl.html',
        controller: 'editStoryController',
        resolve: {
            story: function($route){
            return $route.current.params.story;
            },
            mystories: function(current, $rootScope){

                if($rootScope.user){
                    return current.set.mystories().then(function(stories){
                        return stories;
                    });
                }
                else {
                    return {};
                }
            }
        }
    })
    .when('/logup', {
        templateUrl: 'logup.tpl.html',
        controller: 'logupController2',
        resolve: {
            newlog: function($rootScope, $location, $route){
                if($rootScope.user && !$route.current.params.newlog){
                    return $location.url('/');
                }
                else if($rootScope.user && $route.current.params.newlog){
                    return true;
                }
                else{
                    return false;
                }
            }
        }
    })
    .when('/lolo', {
        templateUrl: 'login.tpl.html'
    })

    .otherwise({redirectTo: '/'});

    $locationProvider.html5Mode(true);

    //we insert the nonce in the header of http requests
    console.log(nonce);
    var interceptor = [function(){

        var service = {
            'request': function(config, $rootScope){
                if(current_user){
                    config.headers = config.header || {};
                    //add nonce to avoid CSRF issues
                    config.headers['X-WP-Nonce'] = nonce;

                    if(config.method == 'POST' && config.url.indexOf('Image') < 0 ){
                        console.log(config);
                        config.headers['Content-Type'] ='application/json';
                    }
                }
                return config;
            }
        };
        return service;
    }];

    $httpProvider.interceptors.push(interceptor);
})
.run(function($rootScope, $window, $location, $route, $routeParams, current){
    //the original wp dashboard remains accessible
    //as angular routing is suspended for these urls
    $rootScope.$on('$locationChangeStart', function(e, next, current){
        if(next.indexOf('wp-admin') > -1 ||
           next.indexOf('wp-login') > -1){
            e.preventDefault();
            $window.location = next;
        }
    });

    $rootScope.user = current_user;
    $rootScope.is_admin = is_admin;
    $rootScope.nonce = nonce;

//    current.set.stories();

    $rootScope.pages = null;
});
