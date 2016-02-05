angular.module('app')

.controller('topbarCtrl', topbarCtrl);

function topbarCtrl($scope, authenticate, $location){
    $scope.newStory = function(){
        $location.url('/edit-story/new');
    };
    $scope.login = function(){
        return  authenticate.signin();
    };
    $scope.logup = function(){
        //return authenticate.signup();
        $location.url('logup');
    };
    $scope.home = function(){
        $location.url('/');
    };
}

