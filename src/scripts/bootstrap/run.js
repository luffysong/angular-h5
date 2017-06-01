
var angular = require('angular');

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

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
        $rootScope.jrHost = '//' + projectEnvConfig.jrHost;
        $rootScope.rongHost = '//' + location.host;
        $rootScope.root = {};
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

    }).run(function ($modal, $rootScope, $location, UserService) {
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

            if (window.ga) {
                window.ga('send', 'pageview', $location.url());
            }

            if (window._hmt) {
                window._hmt.push(['_trackPageview', $location.url()]);
            }

            if (window.krtracker) {
                window.krtracker('trackPageView', $location.url());
            }

            if (window.sa) {
                var uid = UserService.getUID();
                if (uid) {
                    sa.identify(uid);
                }
            }
        });
    })
    .run(function ($rootScope, $location) {
        $rootScope.$on('$locationChangeStart', function () {
            var path = $location.path();
            /*我要上众筹route特殊处理*/
            if ($('.common-header.J_commonHeaderWrapper').css('display') === 'none') {
                $('.common-header.J_commonHeaderWrapper').show();
            }

            var type = path.match(/company/) ? 'company' :
                path.match(/user|organization|search/) ? 'investor' :
                    path.match(/zhongchou|investorValidate/) ? 'zhong' : 'rong';
            if (window.CommonHeader) {
                window.CommonHeader.setNavActive(type);
            }
        });

        $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from) {
            if (
                to.name === 'find.hotFocus' && from.name === 'find.hotFocusDetail' ||
                to.name === 'find.projectAlbum.normal' && from.name === 'demos'
            ) {
                $rootScope.notToReload = true;
            } else {
                $rootScope.notToReload = false;
            }

            if (!$rootScope.notToReload) {
                window.scrollTo(0, 0);
            }

            var _org = false;
            var _investor = false;
            var _com = false;

            function getPage(name, type) {
                var track = false;
                var visitingPage = '';
                if (name === 'find.dailyNews') {
                    visitingPage = 'news_list';
                    track = true;
                } else if (name === 'find.projectAlbum.latest') {
                    visitingPage = 'latest';
                    track = true;
                } else if (name === 'find.projectAlbum.hotest') {
                    visitingPage = 'hottest';
                    track = true;
                } else if (name === 'find.projectAlbum.funding') {
                    visitingPage = 'organization_financing';
                    track = true;
                } else if (name === 'roadShow') {
                    visitingPage = 'calendar';
                    track = true;
                } else if (name === 'demos') {
                    visitingPage = 'set';
                    track = true;
                } else if (name === 'find.hotFocusDetail') {
                    visitingPage = 'hotspot_page';
                    track = true;
                } else if (name === 'find.hotFocus') {
                    visitingPage = 'hotspot_select_list';
                    track = true;
                }else if (name === 'bangdan.orgbdDetail') {
                    visitingPage = 'organization';
                    track = true;
                    _org = true;
                }else if (name === 'bangdan.orgbd') {
                    visitingPage = 'org_top_list';
                    track = true;
                    _org = true;
                }else if (name === 'bangdan.bdshare') {
                    visitingPage = 'share_page';
                    track = true;
                    _org = true;
                }else if (name === 'bangdan.investorbd') {
                    visitingPage = 'investor_top_list';
                    track = true;
                    _investor = true;
                }else if (name === 'bangdan.investorbddetail') {
                    visitingPage = 'investor';
                    track = true;
                    _investor = true;
                }else if (name === 'bangdan.investorshare') {
                    visitingPage = 'investor_share_page';
                    track = true;
                    _investor = true;
                }else if (name === 'bangdan.combddetail') {
                    visitingPage = 'community';
                    track = true;
                    _com = true;
                }else if (name === 'bangdan.comshare') {
                    visitingPage = 'community_share_page';
                    track = true;
                    _com = true;
                }

                if (type === 'name') {
                    return visitingPage;
                } else {
                    return track;
                }
            }

            function getOrgId(name, type) {
                var _orgid = '';
                if (name === 'bangdan.orgbdDetail'
                    || name === 'bangdan.bdshare'
                    || name === 'bangdan.orgbd'
                    || name === 'bangdan.investorbddetail'
                    || name === 'bangdan.investorbd'
                    || name === 'bangdan.investorshare'
                    || name === 'bangdan.combddetail'
                    || name === 'bangdan.comshare') {
                    _orgid = toParams.id;
                }

                if (!_orgid) {
                    if ((location + '').indexOf('bangdan/bdshare')
                || (location + '').indexOf('bangdan/orgbd')
                || (location + '').indexOf('bangdan/orgbddetail')
                || (location + '').indexOf('bangdan/investorbddetail')
                || (location + '').indexOf('bangdan/investorbd')
                || (location + '').indexOf('bangdan/investorshare')
                || (location + '').indexOf('bangdan/combddetail')
                || (location + '').indexOf('bangdan/comshare')) {
                        _orgid = toParams.id;
                    }
                }

                return _orgid;
            }

            function getCommunityType(){
                var type = toParams.communityType || 1;
                if(type == 1){
                    return 'famous_enterprise';
                }else if(type == 2){
                    return 'top_school';
                }else if(type == 3){
                    return 'finance_advisor';
                }else if(type == 4){
                    return 'incubator';
                }
            }

            var params = {
                source: getPage(from.name, 'name'),
                page: getPage(to.name, 'name'),
            };

            if (_org) {
                params.org_id = getOrgId(from.name, 'org');
            } else if (_investor) {
                params.investor_id = getOrgId(from.name, 'investor');
            } else if (_com) {
                params.community_id = getOrgId(from.name, 'com');
                params.community_type = getCommunityType();
            }

            getPage(to.name) && sa.track('ViewPage', params);
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
