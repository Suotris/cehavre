angular.module('app')

.service('resize', resize);

function resize($window){
    var w  = angular.element($window),
        dim = {w: w.width(), h: w.height()};

    return {
        w: dim.w,
        h: dim.h
    };
}
