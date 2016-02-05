angular.module('app')

.factory('coordinateService', function(){
        return {
        collection: collection
    };

    function collection(stories){
        var col = {};
        for(var i = 0; i < stories.length; i++){
            var s = stories[i];
            if(s && s.hasOwnProperty('localisation')){
                col[s.ID] = {
                    position: [
                        s.localisation.lat,
                        s.localisation.lng
                    ]
                };
            }
        }
        return col;
    }
})

.service('animateMap', function(mapProvider){

    function animateMarker(id){
        var mkrs = mapProvider.getMarkers(),
            i = _.findIndex(mkrs, function(s){
            return s.id == id;});

        if(i > -1){
            mkrs[i].options.animation = 'BOUNCE';
            mapProvider.setMarkers(mkrs);
        }
    }
    function resetMarkers(){
        var mkrs = mapProvider.getMarkers();
        _.each(mkrs, function(mk){
            if(mk.options){
                mk.options.animation = 'NULL';
            }
        });
    }

    return {
        animateMarker: animateMarker,
        resetMarkers: resetMarkers
    };
})

.constant('mapDefaults', {
    zoom: 12,
    center: [
        49.5163295,
        0.0672082
    ],
    mapTypeControl: false,
    streeViewControl: false,
    draggable: false,
    options: {
        minZoom: 9,
        rotateControl: false,
        'google.maps.MapTypeId': 'ROADMAP'
    },
    styles:[{
            "featureType": "water",
            "stylers": [ { "color": "#709599" } ] },
        {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [ { "color": "#3e96b5" } ] },
        {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [ { "visibility": "off" } ] },
        {
            "featureType": "transit",
            "elementType": "geometry.stroke",
            "stylers": [ { "color": "#858585" } ] },
        {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [ { "color": "#ffffff" } ] },
        {
            "featureType": "poi",
            "elementType": "geometry.fill",
            "stylers": [ { "color": "#a3d1e5" } ] },
        {
            "featureType": "transit",
            "elementType": "geometry.fill",
            "stylers": [ { "color": "#a3d1e5" } ]
        }
    ]
})
.constant('markerDefaults', {
    animation: 'DROP',
    draggable: false,
    clickable: true
});
