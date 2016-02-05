angular.module('app')

.filter('durationFilter', durationFilter);

function durationFilter() {
    //Returns duration from milliseconds in hh:mm:ss format.
    return function(millseconds) {
        var seconds = Math.floor(millseconds / 1000);
        var m = 60;
        var minutes = Math.floor( seconds/m );
        var scnds = Math.floor( (seconds % m) );
        var timeString = '';
        if(scnds < 10) scnds = "0"+scnds;
        if(minutes < 10) minutes = "0"+minutes;
        timeString = minutes +":"+scnds;
        return timeString;
    };
}
