angular.module('app')

.directive('footer', function(config){
    return {
        templateUrl: 'footer.tpl.html',
        controller: function($scope, $location){
            $scope.goto = goto;

            function goto(loc){
                console.log(loc);
                $location.url(loc);
            }
        }
    };
});
