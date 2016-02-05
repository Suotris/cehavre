angular.module('app')
.controller('postController', postController);

function postController($scope, crt, img){
    $scope.currentStory = crt;

    $scope.login = function(){
        return  authenticate.signin();
    };
    $scope.logup = function(){
        return authenticate.signup();
    };

    if(crt.image.url){
        $scope.img = {
            small: img(crt.image.url).s,
            medium: img(crt.image.url).m
        };
    }
}
