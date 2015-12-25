angular.module('defaultApp')
    .run(function($rootScope){
        $rootScope.REGEXP = $rootScope.REGEXP || {};
        $rootScope.REGEXP.phone = /^\d{11}$/;
        $rootScope.isInApp = !!navigator.userAgent.match(/36kr/) || window.isAppAgent;
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
        var iframe = $('<iframe src="about:blank" style="display: none"></iframe>').appendTo('body');
        $rootScope.$on('$locationChangeStart', function () {
            if(!!navigator.userAgent.match(/36kr/) && !navigator.userAgent.match(/android/)){
                iframe[0].src='kr36://hashchange?_='+ $.now();
            }
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
            /*我要上众筹route特殊处理*/
            if(/zhongchouDesire/.test(path)){
                $(".common-header.J_commonHeaderWrapper").hide();
            }else{
                if($(".common-header.J_commonHeaderWrapper").css("display") == "none"){
                    $(".common-header.J_commonHeaderWrapper").show();
                }
            }
            var type = path.match(/company/) ? 'company' :
                path.match(/user|organization|search/) ? 'investor' :
                    path.match(/zhongchou|investorValidate/) ? 'zhong' : "rong";
            window.CommonHeader && CommonHeader.setNavActive(type);
        });
    })
    .run(function($http, $rootScope, $location, $state, notify, Permission, UserService, $q, $state, $modal){
        //Define Roles
        var login, valid;

        Permission.defineRole('login', login = function () {
            if (UserService.getUID()) {
                console.log('is login')
                return true; // Is anonymous
            }
            _hmt.push(['_trackPageview', "/user/login##fromUser=0"]);
            krtracker('trackPageView', '/user/login');

            setTimeout(function(){
                location.href = '/user/login?from=' + encodeURIComponent(location.href);
            }, 300);
            return false;
        });
        Permission.defineRole('valid', valid = function () {
            var deferred = $q.defer();
            if(!login())return;

            UserService.isProfileValid(function (valid) {
                if (valid) {
                    deferred.resolve();
                } else {

                    var href = location.href,
                        type,
                        from;
                    if(href.indexOf('#/investorValidate')!=-1){
                        type = 'investorValidate';
                        from = href;
                    }else if(href.indexOf('#/investor/apply')!=-1){
                        type = 'investor_apply';
                        from = '#/investor/apply'
                    }else{
                        type = 'other';
                        from = href;
                    }


                    $state.go('guide.welcome', {from:encodeURIComponent(from), type:type});

                    deferred.reject();
                }
            });

            return deferred.promise;
        });

    })


