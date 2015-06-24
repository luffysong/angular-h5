angular.module('defaultApp')
    .run(function($rootScope){
        $rootScope.REGEXP = $rootScope.REGEXP || {};
        $rootScope.REGEXP.phone = /^1\d{10}$/;
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
    }).run(function($modal,$rootScope, $location){
        $rootScope.$on('$locationChangeStart', function () {
            $modal.closeAll();
            window.scrollTo(0, 0);

            window.ga && ga('send', 'pageview', $location.url());
            window._hmt && _hmt.push(['_trackPageview', $location.url()]);
            window.krtracker && krtracker('trackPageView', $location.url());
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


