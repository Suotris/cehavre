angular.module('app')

.directive('storyShuffle', storyShuffle);

function storyShuffle(config, animateMap, $location, $document){
    return {
        templateUrl: 'story-shuffle.tpl.html',

        controller: function($scope, current, $timeout, img){
            $scope.story = null;
            $scope.goto = function(){
                $location.url('post/' + $scope.story.slug);
            };

            $scope.random = {
                 clear : clear,
                 story : story
            };

            $scope.showStory = false;
            $scope.toMap = toMap;
            $scope.setStory = setStory;
            $scope.img = '';

/*
            $scope.search = {
                title: true,
                author: true,
                tags: true,
                content: true
            };
            $scope.searchFilter = searchFilter;
*/

            $scope.$watch(function(){return current.get.story();},
                          function(newVal){
                $timeout(function(){
                    $scope.story = newVal;
                    $scope.showStory = newVal ? true : false;
                    if($scope.story && $scope.story.image.url){
                        $scope.img = img($scope.story.image.url);
                    }
                    else {
                        $scope.img = null;
                    }

                });
            }, true);

            function clear(){
                animateMap.resetMarkers();
                $scope.showStory = false;
                $timeout(function(){current.set.story(null);}, 300);
            }
            function story(){
                current.get.stories().then(function(stories){
                    var newStory = stories[_.random(0, stories.length, false)].ID;
                    if(newStory !== undefined){
                        setStory(newStory);
                    }
                });
            }
            function setStory(ID){
                current.set.story(ID);
                $scope.searchFocused = false;
                $scope.showStory = true;
                animateMap.animateMarker(ID);
            }

            function toMap(){
                var map = angular.element(document.getElementById('front-map'));
                $document.scrollToElement(map);
            }

            /*function searchFilter(){
                return function(items, field) {
                    console.log('called');
                    var result = [],
                        search = $scope.search,
                        stories = $scope.stories,
                        term = $scope.searchTerm;

                    for(var i = 0; i < stories.length; i++){
                        if(search.title && stories[i].title.indexOf(term) > -1 ||
                           search.author && stories[i].author.indexOf(term) > -1 ||
                           search.content && stories[i].content.indexOf(term) > -1){
                            result.push(stories[i]);
                        } else if(search.tags){
                            for(var j = 0; j < stories[i].tags[j]; j++){
                                if(stories[i].tags[j].indexOf(term) > -1){
                                    result.push(stories[i]);
                                    break;
                                }
                            }
                        }
                    }
                    console.log(result);
                    return result;
                };
            }*/
        }
    };
}
