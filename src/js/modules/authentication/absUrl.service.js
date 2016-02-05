angular.module('wpAngularAuth')
.service('absUrl', absUrl);

function absUrl($location){
    return {url: url};

    function url(){
        var long = $location.absUrl(),
            res = long.substr(0,long.length-$location.path().length);

        return res;
    }
}
