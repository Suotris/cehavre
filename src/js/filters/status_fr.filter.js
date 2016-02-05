angular.module('app')


.filter('status_fr', status_fr);

function status_fr(){
    return function(status){
        var dic = {
            draft: 'brouillon',
            publish: 'publié',
            pending: 'en attente de révision'
        };
        return dic[status];
    };
}
