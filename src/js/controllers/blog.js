/*
angular.module('app')

.controller('blogController', function($scope, blogPosts, $location){
    blogPosts.getAll().then(function(p){
        $scope.posts = p;
    });

    $scope.goto = function(slug){
        $location.url('blog/'+slug);
    };
})

.controller('blogPostController', function($scope, crt, blogService){
    $scope.currentStory = crt;
    console.log(crt);
    //$scope.category = currentCategory.which($scope.currentStory);
     blogService.getData.comments($scope.currentStory.id).then(function(comments){
        $scope.comments = comments;
    });

})

.service('blogPosts', function(blogService, $q){

    var posts;

    function getOne(aPost){
        console.log('in one');
        function find(ball){
            return _.find(ball, function(b){return b.slug == aPost;});
        }

        var defer = $q.defer();
        if(posts){
            defer.resolve(find(posts));
        } else {
            blogService.getData.blog().then(function(blogPosts){
                defer.resolve(find(blogPosts));
            });}
        return defer.promise;
    }

    function getAll(){
        var defer = $q.defer();
        if(posts){
            defer.resolve(posts);
        } else {
            blogService.getData.blog().then(function(blogPosts){
                defer.resolve(blogPosts);
            });
        }
        return defer.promise;
    }

    return {
        getAll:getAll,
        getOne:getOne
    };
});
*/
