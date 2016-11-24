
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('LoginController', LoginController);

function LoginController(UserService, $state, $stateParams) {
    var vm = this;

    //轮播图返回的数据
    vm.slides = [];
    vm.responseData = {};
    vm.activityName = $stateParams.activityName;

    init();
    function init() {
        if (window.WEIXINSHARE && window.WEIXINSHARE.shareTitle) {
            document.title = window.WEIXINSHARE.shareTitle;
        }

        if (UserService.getUID()) {
            $state.go('findInvestor', {
                activityName: vm.activityName
            });
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
            $state.go('findInvestor', {
                activityName: vm.activityName
            });
        };

        window.initCss = function () {
            $('#activityInfoFirst').hide();
        };

        window.initFooter = function () {
            $('.header-banner-wrapper').css('display', 'flex');
            if (vm.activityName) {
                $('#openApp').attr('href', 'https://36kr.com/app/tou?ktm_source=investorSuccess.' + vm.activityName);
            }
        };
    }

}
