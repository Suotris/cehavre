angular.module('app')

.directive('social', function(config){
    return{
        templateUrl: 'social.tpl.html',
        scope: {
            story: '='
        },
        controller: function($scope){
            if($scope.story.image.url){
                $scope.media = $scope.story.image.url;
            }
            else {
                $scope.media = config.THEME_URL + '/assets/images/cover.png';
            }

            $scope.data = {
                url: config.ABS_URL + '/post/' + $scope.story.slug,
                //TODO: link media to post feature when enabled.
                media: $scope.media,
                text: $scope.story.title,
                content: $scope.story.excerpt
            };
        }
    };
});
