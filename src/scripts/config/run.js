angular.module('defaultApp')
    .run(function($rootScope){
        $rootScope.REGEXP = $rootScope.REGEXP || {};
        $rootScope.REGEXP.phone = /^1\d{10}$/;
        $rootScope.isInApp = !!navigator.userAgent.match(/36kr/);
    })
    .run(function ($http, $rootScope,notify) {
    	notify.config({
            templateUrl: 'templates/angular-notify.html'
        });
        //全局外部host地址
        $rootScope.ucHost = '//'+projectEnvConfig['ucHost'];
        $rootScope.helpHost = '//'+projectEnvConfig['helpHost'];
        $rootScope.rongHost = '//'+location.host;
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
    }).run(function($modal,$rootScope,$location){
        $rootScope.$on('$locationChangeStart', function () {
            if(!!navigator.userAgent.match(/36kr/ && !navigator.userAgent.match(/android/)){
                window.location = 'kr36://hashchange';
            }
            $modal.closeAll();
        });
    })
    .run(function($rootScope, $location){
        $rootScope.$on('$locationChangeStart', function() {
            var path = $location.path();
            var type = path.match(/company/) ? 'company' :
                path.match(/user|organization|search/) ? 'investor' :
                    path.match(/zhongchou|investorValidate/) ? 'zhong' : "rong";
            CommonHeader.setNavActive(type);
        });
    });


