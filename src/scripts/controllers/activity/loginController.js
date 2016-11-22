
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('LoginController', LoginController);

function LoginController(UserService, $state, $stateParams) {
    var vm = this;

    //轮播图返回的数据
    vm.slides = [];
    vm.responseData = {};
    vm.ktm_source = $stateParams.ktm_source;

    init();
    function init() {
        if (UserService.getUID()) {
            console.log('已登陆');
            $state.go('findInvestor', {
                ktm_source: vm.ktm_source
            });
        }

        window.LOGIN_HOST = '//passport.36kr.com';

        // var href = $('link[href*="login-theme"]').attr('href');
        var href = '/styles/login-theme.css';

        if (href) {
            if (href.match(/^http|^\/\//)) {
                window.LOGIN_CSS =  href;
            }else {
                window.LOGIN_CSS =  '//' + location.host + href;
            }
        }

        $('link[href*="login-theme"]').remove();

        window.ktm_source = $stateParams.ktm_source;
        window.closeLoginModal = function () {
            console.log('登陆成功!');
            $state.go('findInvestor', {
                ktm_source: vm.ktm_source
            });
        };

        window.test = function () {
            console.log('4');
            $('#activityInfoFirst').hide();
        };
    }

}
