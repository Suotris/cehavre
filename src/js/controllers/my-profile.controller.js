angular.module('app')

.controller('myProfileController', myProfileController);

function myProfileController($scope, $rootScope){
    $scope.profile = $rootScope.user;
}
