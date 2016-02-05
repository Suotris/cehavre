angular.module('app')
.service('current', Current);

function Current(blogService, animateMap, $rootScope, $q){
    var stories = null,
        story = null,
        mystories = null;

    return {
        get: {
            stories: getStories,
            story: getStory,
            mystories: getMyStories
        },
        set: {
            stories: setStories,
            story: setStory,
            mystories: setMyStories
        }
    };

    function setStories(){
        return $q(function(resolve, reject){
            blogService.getData.stories().then(function(posts){
            resolve(stories = posts);
            });
        });
    }
    function setStory(name){
        if(name === null){
            story = null;
            animateMap.resetMarkers();
        }
        //sets story by slug or id
        else if(/^\d+$/.test(name)){
            story = _.find(stories, function(c){
                 return c.ID == name;});
            animateMap.animateMarker(story.ID);
        } else {
            story = _.find(stories, function(c){
                 return c.slug == name;});
            animateMap.animateMarker(story.ID);
        }
        return story;
    }
    function setMyStories(user){
        user = user || $rootScope.user.ID;
        return blogService.getData.mystories(user).then(function(stories){
            mystories = stories;
            return mystories;
        });
    }

    function getStories(){
        var deferred = $q.defer();
        if(stories){
            deferred.resolve(stories);
        } else {
            setStories().then(function(){
            deferred.resolve(stories);
            });
        }
        return deferred.promise;
    }
    function getStory(){return story;}
    function getMyStories(){return mystories;}
}
