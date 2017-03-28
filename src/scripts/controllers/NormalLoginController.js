
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('NormalLoginController', NormalLoginController);

function NormalLoginController(UserService, $state, $stateParams) {
    var vm = this;

    //轮播图返回的数据
    vm.slides = [];
    vm.responseData = {};
    vm.type = $stateParams.type;
    vm.bothh3 = false;
    vm.investorh3 = false;
    vm.startuph3 = false;

    function init() {
        removeHeader();
        window.LOGIN_HOST = '//passport.36kr.com';

        var href = $('link[href*="login-theme"]').attr('href');

        // if (!href) {
        //     href = '/styles/login-theme.css';
        // }

        if (href) {
            if (href.match(/^http|^\/\//)) {
                window.LOGIN_CSS =  href;
            }else {
                window.LOGIN_CSS =  '//' + location.host + href;
            }
        }

        $('link[href*="login-theme"]').remove();

        window.TYPE = vm.type;
        window.closeLoginModal = function () {
        };

        window.initCss = function () {
            $('#activityInfoFirst').hide();
        };

        window.initCss();
        if (!UserService.getUID()) {
            window.initCss();
        }

        window.initFooter = function () {
            $('.header-banner-wrapper').css('display', 'flex');
            if (vm.activityName) {
                $('#openApp').attr('href', 'https://36kr.com/app/tou?ktm_source=investorSuccess.' + vm.activityName);
            }
        };

        function removeHeader() {
            $('.common-header.J_commonHeaderWrapper').remove();
        }
    }

    init();
}
