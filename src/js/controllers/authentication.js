
angular.module('app')

.controller('loginController', function($scope, $modalInstance){
    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.forgot = false;
})

.controller('logupController2', function($scope, newlog){
    $scope.newlog = newlog;
    console.log($scope.newlog);
});
