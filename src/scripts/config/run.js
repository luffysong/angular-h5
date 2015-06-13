angular.module('defaultApp')
    .run(function($rootScope){
        $rootScope.REGEXP = $rootScope.REGEXP || {};
        $rootScope.REGEXP.phone = /^1\d{10}$/;
    })
    .run(function ($http, $rootScope,notify) {
    	notify.config({
            templateUrl: 'templates/angular-notify.html'
        });
    }).run(function($modal){
        var originOpen = $modal.open;
        var openedWindow = [];
        $modal.open = function(){
            var instance = originOpen.apply($modal, arguments);
            openedWindow.push(instance);
            return instance;
        };
        $modal.closeAll = function(){
            openedWindow.forEach(function(pop){
                if(pop.dismiss){
                    pop.dismiss();
                }
            });
        }
    }).run(function($modal,$rootScope){
        $rootScope.$on('$locationChangeStart', function () {
            $modal.closeAll();
        });
    });


