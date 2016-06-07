
var angular = require('angular');

angular.module('defaultApp')
    .run(function ($rootScope) {
        $rootScope.REGEXP = $rootScope.REGEXP || {};
        $rootScope.REGEXP.phone = /^[0-9]*$/;
        $rootScope.isInApp = !!navigator.userAgent.match(/36kr/) || window.isAppAgent;
        testLocalStorage();
        function testLocalStorage() {
            if (typeof localStorage === 'object') {
                try {
                    localStorage.setItem('localStorage', 1);
                    localStorage.removeItem('localStorage');
                } catch (e) {
                    window.Storage.prototype._setItem = window.Storage.prototype.setItem;
                    window.Storage.prototype.setItem = function () {};
                }
            }
        }
    })
    .run(function ($http, $rootScope, notify) {
        notify.config({
            templateUrl: 'templates/angular-notify.html',
        });

        //全局外部host地址
        $rootScope.ucHost = '//' + projectEnvConfig.ucHost;
        $rootScope.helpHost = '//' + projectEnvConfig.helpHost;
        $rootScope.zhongHost = '//' + projectEnvConfig.zhongHost;
        $rootScope.rongHost = '//' + location.host;
    }).run(function ($modal) {
        var originOpen = $modal.open;
        var openedWindow = [];
        $modal.open = function () {
            var instance = originOpen.apply($modal, arguments);
            openedWindow.push(instance);
            return instance;
        };

        $modal.closeAll = function () {
            openedWindow.forEach(function (pop) {
                if (pop.dismiss) {
                    pop.dismiss();
                }
            });
        };

    }).run(function ($modal, $rootScope, $location) {
        var iframe = $('<iframe src="about:blank" style="display: none"></iframe>').appendTo('body');

        function androidVersion4() {
            return /android/.test(navigator.userAgent) && /krversion4.0/.test(navigator.userAgent);
        }

        $rootScope.$on('$stateChangeStart', function (e, $toState, $toStateParams) {
            if (androidVersion4() && /\/company\//.test($toState.url)) {
                e.preventDefault();
                iframe[0].src = 'kr36://hashchange?companyId=' +
                    $toStateParams.id +
                    '&_=' + $.now();
            }
        });

        $rootScope.$on('$locationChangeStart', function () {
            if (/36kr\-iOS/.test(navigator.userAgent) && !/android/.test(navigator.userAgent)) {
                iframe[0].src = 'kr36://hashchange?_=' + $.now();
            }

            $modal.closeAll();
            window.scrollTo(0, 0);

            if (window.ga) {
                window.ga('send', 'pageview', $location.url());
            }

            if (window._hmt) {
                window._hmt.push(['_trackPageview', $location.url()]);
            }

            if (window.krtracker) {
                window.krtracker('trackPageView', $location.url());
            }
        });
    })
    .run(function ($rootScope, $location) {
        $rootScope.$on('$locationChangeStart', function () {
            var path = $location.path();
            /*我要上众筹route特殊处理*/
            if (/zhongchouDesire/.test(path)) {
                $('.common-header.J_commonHeaderWrapper').hide();
            }else {
                if ($('.common-header.J_commonHeaderWrapper').css('display') === 'none') {
                    $('.common-header.J_commonHeaderWrapper').show();
                }
            }

            var type = path.match(/company/) ? 'company' :
                path.match(/user|organization|search/) ? 'investor' :
                    path.match(/zhongchou|investorValidate/) ? 'zhong' : 'rong';
            if (window.CommonHeader) {
                window.CommonHeader.setNavActive(type);
            }
        });
    }).run(function ($http, $rootScope, $location, $state, notify, Permission, UserService, $q, CredentialService) {
        //Define Roles
        var login;
        var valid;

        Permission.defineRole('login', login = function () {
            if (UserService.getUID()) {
                console.log('is login');
                return true;
            }

            // Is anonymous
            _hmt.push(['_trackPageview', '/user/login##fromUser=0']);
            krtracker('trackPageView', '/user/login');

            setTimeout(function () {
                CredentialService.directToLogin();
            }, 300);

            return false;
        });

        Permission.defineRole('valid', valid = function () {
            var deferred = $q.defer();
            if (!login()) {
                return;
            }

            UserService.isProfileValid(function (valid) {
                if (valid) {
                    deferred.resolve();
                } else {

                    var href = location.href;
                    var type;
                    var   from;
                    if (href.indexOf('#/investor/apply') !== -1) {
                        type = 'investor_apply';
                        from = '#/investor/apply';
                    }else {
                        type = 'other';
                        from = href;
                    }

                    $state.go('guide.welcome', { from:encodeURIComponent(from), type:type });

                    deferred.reject();
                }
            });

            return deferred.promise;
        });

    });
