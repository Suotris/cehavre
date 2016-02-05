angular.module('app')
.controller('editStoryController', editStoryController);

function editStoryController($scope, $rootScope, $location, $timeout, current, blogService, story, mystories, authenticate){
    $scope.save = save;
    $scope.publish = publish;
    $scope.mod = mod;
    $scope.updateTags = updateTags;
    $scope.removeTag = removeTag;
    $scope.t = {};
    $scope.t.tags = "";
    $scope.uploadImage = uploadImage;
    $scope.deleteImage = deleteImage;

    var geocoder = new google.maps.Geocoder();

    if(story != 'new'){
        $scope.story = _.find(mystories, function(st){
            return st.slug == story;
        });
    }
    else {
        $scope.story = {
            title: '',
            content: '',
            author: $rootScope.user.ID,
            localisation:{
                address: 'adresse',
                lat: 49.49,
                lng: 0.1,
            }
        };
    }

    $scope.markers = [
        {
            id: 'editMarker',
            position: '('+ $scope.story.localisation.lat + ',' +
                      $scope.story.localisation.lng + ')',
            options: {
                animation: 'none',
                draggable: true,
            }
        }
    ];
    $scope.mapOptions = {
        center: [
        $scope.story.localisation.lat,
        $scope.story.localisation.lng
    ]
    };

    $scope.mapClick = mapClick;
    $scope.dragEnd = dragEnd;
    $scope.drag = drag;

    $scope.login = function(){
        return  authenticate.signin();
    };
    $scope.logup = function(){
        return authenticate.signup();
    };

    function drag(m){
/*
        $scope.story.localisation.lat = m.latLng.lat();
        $scope.story.localisation.lng = m.latLng.lng();
*/
    }

    function mapClick(event, map){
        var lat = event.latLng.lat(),
            lng = event.latLng.lng();
        $scope.markers.position = '('+ lat + ',' + lng + ')';
        drop(lat, lng);
        map.markers.editMarker.setPosition({lat:lat, lng:lng});
    }

    function dragEnd(m){
        drop(m.position.lat(), m.position.lng());
    }

    function drop(lat, lng){
        $scope.story.localisation.lat = lat;
        $scope.story.localisation.lng = lng;

        geocoder.geocode({
            latLng: {lat: lat, lng: lng}
        }, function(responses) {
            if (responses && responses.length > 0) {
                $scope.story.localisation.address = responses[0].formatted_address;
            } else {
                $scope.story.localisation.address = 'Adresse inconnue';
            }
            $scope.$apply();
        });
        $scope.mod();
    }

    function save(){
        $scope.error = false;

        if(!$scope.story.ID){
            if(!$scope.story.title | $scope.story.title.length < 1){
            $scope.error = 'Veuillez saisir un titre avant de sauvegarder.';
            }
            else if($scope.story.title.length < 3){
                $scope.error = 'Le titre doit contenir au moins 3 caractères.';
            }
            else if($scope.story.title == 'new'){
                $scope.error = 'Le titre saisi n\'est pas valide.';
            }
            else if ($scope.story.content.length <1){
                $scope.error = 'Votre histoire doit avoir un contenu pour être sauvegardée.';
            }
            else {
                newStory().then(function(){
                    $location.url('edit-story/'+ $scope.story.slug);
                });
            }
        }
        else {
            updateStory();
        }
    }

    function newStory(){
        return blogService.postData.newStory($scope.story)
        .then(function(result){
            $scope.story.slug = result.data.slug;
            console.log($scope.story.slug);
            return current.set.mystories($rootScope.user.ID);
        }, function(error){
            console.log(error);
            $scope.error = 'Une erreur est survenue. '+
                'Veuillez réessayer plus tard.';
        })
        .then(function(r){
            $scope.modified = false;
            $scope.success = 'Les changements ont bien été sauvegardés.';
        });
    }

    function updateStory(){
        blogService.postData.updateStory($scope.story)
        .then(function(result){
            return current.set.mystories();
        }).then(function(){
            $scope.modified = false;
            $scope.success = 'Les changements ont bien été sauvegardés.';
        }).catch(function(e){
            console.log(e);
            $scope.error = 'Une erreur est survenue. '+
                           'Veuillez réessayer plus tard.';
        });
    }

    function publish(){
        blogService.postData.publishStory($scope.story).then(function(r){
            current.set.mystories();
            $scope.success = 'Votre histoire a bien été envoyée à notre éditrice. Vous recevrez un email dès que nous l\'aurons publiée.';
            $timeout(function(){
                $location.url('/my-stories');
            }, 3000);
        }).catch(function(e){
            console.log(e);
            $scope.error = 'Une erreur est survenue. '+
                           'Veuillez réessayer plus tard.';
        });
    }

    function mod(){
        $scope.modified = true;
         $scope.success = false;
         $scope.error = false;
     }

    function updateTags(){
        $scope.story.tags = _.union($scope.t.tags.trim().split(','), $scope.story.tags);
        $scope.t.tags = "";
        $scope.mod();
    }

    function removeTag(tag){
        _.pull($scope.story.tags, tag);
        $scope.mod();
    }

    function uploadImage(file, errFiles) {
        //TODO: add a spinner while the image is loading
        //TODO: add min size for the pic
        //TODO: replace the plugin with custom function

        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if(file && $scope.story.ID){
            return blogService.postData.uploadImage(file, $scope.story.ID)
            .then(function(result){
                $scope.story = result.data;
                return current.set.mystories();
            });
        }
    }

    function deleteImage(){
        console.log($scope.story.image.id);
        blogService.postData.deleteImage($scope.story.image.id).then(function(result){
            $scope.story.image = {
                url: null,
                id: null
            };
        });
    }
}
