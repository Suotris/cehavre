angular.module('app')

.service('mapProvider', mapProvider);

function mapProvider(mapDefaults,  markerDefaults){
    var map_current = mapDefaults,
        markers_current = markerDefaults;

    return {
        mapOptions : mapOptions,
        mapCurrent : map_current,
        markerOptions: markerOptions,
        newMarkers: newMarkers,
        setMapOptions: setMapOptions,
        setMarkers: setMarkers,
        getMarkers: getMarkers,
        resetDefaults: resetDefaults
    };

    function setMapOptions(newVals){
        map_current = mapOptions(newVals);
    }
    function setMarkers(newMkrs){
        markers_current = newMkrs;
        return markers_current;
    }
    function mapOptions(newVals){
        return _.merge(_.cloneDeep(map_current), newVals);
    }
    function markerOptions(newVals){
        return _.merge(_.cloneDeep(markerDefaults), newVals);
    }

    function getMarkers(){
        return markers_current;
    }

    function newMarkers(collection, options){
        var mkrs = [];
            _.each(collection, function(coords, id){
                coords.id = id;
                coords.options = markerOptions(options);
                mkrs.push(coords);
            });
        markers_current = mkrs;

        return mkrs;
    }

    function resetDefaults(){
        map_current = mapDefaults;
    }
}
