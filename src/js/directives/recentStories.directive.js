angular.module('app')
.directive('recentStories', recentStories);

function recentStories(){
    return {
        restrict: 'A',
        controller: function($scope, $location, current){
            current.get.stories().then(function(stories){
                $scope.stories = stories;
            });
            $scope.go = function(slug){
                $location.url('post/'+slug);
            };
        }
    };
}
