
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('KrspaceController', KrspaceController);

function KrspaceController($stateParams, FindService, $state, UserService) {
    var vm = this;
    vm.ktm_source = $stateParams.ktm_source;
    vm.start = start;

    init();

    function init() {
        $('html').css('overflow', 'auto');
        $('body').css('overflow', 'auto');
        initWeixin();
        if (window.WEIXINSHARE && window.WEIXINSHARE.shareTitle) {
            document.title = window.WEIXINSHARE.shareTitle;
        }
    }

    function initWeixin() {
        window.WEIXINSHARE = {
            shareTitle: '氪空间第8期毕业礼·独家招募',
            shareUrl: window.location.href,
            shareImg: 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png',
            shareDesc: '来「36氪创投助手」，发现最新最热优质项目！',
        };
        var obj = {};
        window.InitWeixin(obj);
    }

    //查看是否参与过活动
    function start() {

        if (!UserService.getUID()) {
            console.log('未登陆');
            $state.go('findLogin', {
                ktm_source: vm.ktm_source
            });
        } else {
            getActivity();
        }
    }

    function getActivity() {
        var sendData = {
            activityName: vm.ktm_source
        };
        FindService.getActivity(sendData)
            .then(function (response) {
                vm.hasSubmit = response.data.hasSubmit;
                if (!vm.hasSubmit) {
                    $state.go('findInvestor', {
                        ktm_source: vm.ktm_source
                    });
                } else {
                    $state.go('findInvestorSuccess', {
                        ktm_source: vm.ktm_source
                    });
                }
            })
            .catch(error);
    }

    function error(err) {
        if (err.code === 403) {
            $state.go('findLogin', {
                ktm_source: vm.ktm_source
            });
        }
    }
}
