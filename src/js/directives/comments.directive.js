angular.module('app')

.directive('comments', function(config){
    return {
        templateUrl: 'comments.tpl.html',
        controller: function($scope, blogService, authenticate, $rootScope){

            _.defer(function(){
                var id;
                if($scope.currentStory.hasOwnProperty('ID')){
                   id = $scope.currentStory.ID;
                }
                else if($scope.currentStory.hasOwnProperty('id')){
                    id = $scope.currentStory.id;
                }
                blogService.getData.comments(id).then(function(comments){
                    $scope.comments = comments;
                });
            });

            $scope.newComment = {
                post: $scope.currentStory.ID
            };

            $scope.user = $rootScope.user;
            if($scope.user){
                $scope.newComment.author_name = $scope.user.first_name;
                $scope.newComment.author_email = $scope.user.email;
            }

            $scope.sendComment = sendComments;

            function sendComments(){
                blogService.postData.comment($scope.newComment)
                    .then(function(r){
                        $scope.newComment.content = '';
                        return blogService.getData.comments($scope.currentStory.ID);
                    }).then(function(comments){
                        $scope.comments = comments;
                });
            }
        }
    };
});
