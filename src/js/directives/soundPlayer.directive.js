angular.module('app').directive('soundPlayer', soundPlayer);

function soundPlayer(config){
    return {
        templateUrl: 'soundPlayer.tpl.html',
        scope: {
            url: '='
        },
        controller: function($scope, $timeout, $sce){

            var widgetIframe, widget;

            $scope.play = toggleSound;
            $scope.barClick = barClick;
            $scope.playing = false;
            $scope.elapsed = 0;
            $scope.elapsedPc = 0;

            if($scope.url){
                widgetIframe = document.getElementById('sc-widget');
                widget       = SC.Widget(widgetIframe);
                $scope.hasSound = true;
                widget.load($scope.url, {
                    auto_play : false,
                    buying: false,
                    liking: false,
                    download: false,
                    sharing: false,
                    show_artwork: false,
                    show_comments: false,
                    show_playcount: false,
                    show_user: false
                });

                widget.bind(SC.Widget.Events.READY, function(){
                    widget.getDuration(function(d){
                        $scope.duration = d;
                        $scope.loaded = true;
                        $scope.$apply();
                    });

                    widget.bind(SC.Widget.Events.PLAY_PROGRESS, function(r){
                        $scope.elapsed = Math.floor(r.currentPosition);
                        $scope.elapsedPc = r.relativePosition*100;
                    });
                });
            }
            else {
                $scope.hasSound = false;
            }

            function toggleSound(){
                function elapsed(){
                    $timeout(function(){
                //we need to apply because the elapsed time is fetched from outside angular
                        $scope.$apply();
                        if($scope.playing) elapsed();
                    }, 100);
                }

                if($scope.playing){
                    widget.pause();
                    $scope.playing = false;
                } else {
                    widget.play();
                    $scope.playing = true;

                    //we start a loop to update the playing position
                    elapsed();
                }
            }

            //adds clickable behavior to the progress bar
            function barClick($event){
                var bar = $event.currentTarget,
                    rect = bar.getBoundingClientRect(),
                    position = Math.floor((($event.clientX - rect.left)/rect.width)*$scope.duration);
                console.log(rect.left);
                widget.seekTo(position);
                if(!$scope.playing){
                    $scope.elapsed = position;
                    $scope.elapsedPc = (position/$scope.duration)*100;
                }
            }
        }
    };
}
