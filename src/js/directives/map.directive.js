angular.module('app')

.directive('storyMap', storyMap);

function storyMap(config){
    return {
        templateUrl: 'map.tpl.html',
        scope: {
            markers: '=',
            opt: "=",
            onmarkerclick: '=',
            ondrag: '=',
            ondragend: '=',
            onmapclick: '='
        },
        controller: function($scope, mapProvider){
        //TODO: find a way to disable draggable when on small screens
            $scope.options = mapProvider.mapOptions($scope.opt);
            $scope.drag = drag;
            $scope.dragend = dragend;
            $scope.markerclick = markerclick;
            $scope.mapclick = mapclick;

            function drag(){
                if($scope.ondrag){
                    $scope.ondrag(this);
                }
            }

            function dragend(){
                if($scope.ondragend){
                    $scope.ondragend(this);
                }
            }

            function markerclick(){
                if($scope.onmarkerclick){
                    $scope.onmarkerclick(this);
                }
            }

            function mapclick(e){
                if($scope.onmapclick){
                    $scope.onmapclick(e, this);
                }
            }
        }
    };
}
