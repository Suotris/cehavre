angular.module('app')

.controller('aboutController', aboutController);

function aboutController(pages, $scope){
    $scope.page = pages;
}
