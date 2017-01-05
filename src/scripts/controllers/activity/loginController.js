
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('LoginController', LoginController);

function LoginController(UserService, $state, $stateParams) {
    var vm = this;

    //轮播图返回的数据
    vm.slides = [];
    vm.responseData = {};
    vm.activityName = $stateParams.activityName;
    vm.type = $stateParams.type;

    init();
    function init() {
        if (window.WEIXINSHARE && window.WEIXINSHARE.shareTitle) {
            document.title = window.WEIXINSHARE.shareTitle;
        }

        if (UserService.getUID()) {
            if (vm.type === 'startup') {
                $state.go('findStartUp', {
                    activityName: vm.activityName
                });
            } else if (vm.type === 'investor') {
                $state.go('findInvestor', {
                    activityName: vm.activityName
                });
            } else {
                $state.go('findInvestor', {
                    activityName: vm.activityName
                });
            }
        }

        window.LOGIN_HOST = '//passport.36kr.com';

        var href = $('link[href*="login-theme"]').attr('href');
        if (href) {
            if (href.match(/^http|^\/\//)) {
                window.LOGIN_CSS =  href;
            }else {
                window.LOGIN_CSS =  '//' + location.host + href;
            }
        }

        $('link[href*="login-theme"]').remove();

        window.activityName = $stateParams.activityName;
        window.closeLoginModal = function () {
            console.log('0000000000000000', vm.type);
            if (vm.type === 'startup') {
                $state.go('findStartUp', {
                    activityName: vm.activityName
                });
            } else if (vm.type === 'investor') {
                $state.go('findInvestor', {
                    activityName: vm.activityName
                });
            }
        };

        window.initCss = function () {
            $('#activityInfoFirst').hide();
        };

        window.initCss();

        window.initFooter = function () {
            $('.header-banner-wrapper').css('display', 'flex');
            if (vm.activityName) {
                $('#openApp').attr('href', 'https://36kr.com/app/tou?ktm_source=investorSuccess.' + vm.activityName);
            }
        };
    }

}
