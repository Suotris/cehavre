angular.module('app')

.controller('myStoriesController', myStoriesController);

function myStoriesController($scope, $location, $modal, current, blogService, mystories){
    $scope.status = status;

    $scope.$watch(function(){return current.get.mystories();}, function(newVal, oldVal){
        $scope.myStories = newVal;
    });

    $scope.delete = function(id){
        var deleteModal = $modal.open({
            template: '<div id="delete-modal">'+
                        '<p>Etes-vous sur de vouloir supprimer cette histoire?</p>'+
            '<div id="delete-modal-buttons"><button class="button" ng-click="del()">Oui</button>'+
            '<button class="button" ng-click="exit()">Non</button></div>'+
            '<div>{{deleteMsg}}</div>'+
                      '</div>',
            resolve: {id: function(){
                console.log(id);
                return id;
            }},
            controller: function($scope, $timeout, $modalInstance,id){
                $scope.del = del;
                $scope.exit = exit;
                $scope.deleteMsg = '';

                function del(){
                    blogService.postData.deleteStory(id).then(function(r){
                        $scope.deleteMsg = 'Votre histoire a bien été supprimée';
                        $timeout(function(){
                            $modalInstance.dismiss('deleted');
                            $scope.deleteMsg = '';
                            current.set.mystories();
                        },1500);
                    });
                }
                function exit(){
                    console.log('exited');
                    $modalInstance.dismiss('cancel');
                }
            }
        });
    };

    $scope.edit = function(slug){
        $location.url('edit-story/' + slug);
    };

    $scope.goto = function(slug){
        $location.url('post/' + slug);
    };

    function status(story, s){
        console.log(story.status == s);
        return story.status == s;
    }
}
