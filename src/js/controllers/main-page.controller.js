angular.module('app')

.controller('mainPageController', mainPageController);

function mainPageController($scope, markers, animateMap, current, $document){
    $scope.markers = markers;

    $scope.onclick = onclick;

    function onclick(mkr){
        animateMap.resetMarkers();
        current.set.story(mkr.id);
        $scope.$apply();
        //var box = angular.element(document.getElementById('snap-title'));
        var box = angular.element(document.getElementById('snap-offset'));
        $document.scrollToElementAnimated(box);
    }
}
