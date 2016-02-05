//Displays the login form
//The controller handles options and sends form data to the http service

angular.module('wpAngularAuth')

.directive('wpAngularLogin', wpAngularLogin);

function wpAngularLogin(){
    return {
        templateUrl: 'wpAngularLogin.tpl.html',
        scope: {},
        controller: wpAngularLoginController,
        controllerAs: 'vm',
        bindToController: true
    };
}

function wpAngularLoginController(httpAuth, $location, $window, absUrl){
    var vm = this;

    vm.data = {
        log: '',
        pwd: '',
        'wp-submit':'Log In'
    };
    vm.submit = submit;

    console.log(vm.redirect);
    //TODO: bind the controller with variables input in directive call

    function submit(){
        httpAuth.login(vm.data).then(function(r){
            var url;
            if(vm.redirect){
                url = absUrl.url() + vm.redirect;
            }
            else {
                url = absUrl.url() + $location.path();
            }
            $window.location.assign(url);
        });
    }
}
