angular.module('app')

.service('authenticate', function($modal, $location){
    function signin(){
        var modalInstance = $modal.open({
            templateUrl: 'login-modal.html',
            controller: 'loginController'
        });
    }
    function signup(){
/*
        var modalInstance = $modal.open({
            templateUrl: 'logup-modal.html',
            controller: 'logupController'
        });
*/
        $location.url('logup');
    }

    return {
        signin: signin,
        signup: signup
    };
});
