angular.module('wpAngularAuth')
    .service('httpAuth', httpAuth);

function httpAuth($http, $location){
    return {
        login: login,
        logup: logup,
        update: update,
        retrievePw: retrievePw
    };

    function login(data, redirect){
        var d = data;
/*        if(d.redirect_to === ''){
            d.redirect_to = $location.absUrl() - $location.path();
        }*/

        return POST('wp-login.php', d);
    }

    function logup(){

    }

    function update(){

    }

    function retrievePw(){

    }

    function  POST(url, data){
        return $http({
            method: 'POST',
            headers : {'Content-Type': 'application/x-www-form-urlencoded'},
            url: url,
            data: data,
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            }
        })
        .then(function(response) {
            console.log(response);
            return response.data;
        });
    }
}
