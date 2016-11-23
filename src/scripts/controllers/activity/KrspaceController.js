
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('KrspaceController', KrspaceController);

function KrspaceController($stateParams, FindService, $state, UserService) {
    var vm = this;
    vm.activityName = $stateParams.activityName;
    vm.start = start;

    init();

    function init() {
        if (typeof (vm.activityName) !== 'string' && vm.activityName[0]) {
            vm.activityName = vm.activityName[0];
        }

        $('html').css('overflow', 'auto');
        $('body').css('overflow', 'auto');
        initWeixin();
        if (window.WEIXINSHARE && window.WEIXINSHARE.shareTitle) {
            document.title = window.WEIXINSHARE.shareTitle;
        }
    }

    function initWeixin() {
        window.WEIXINSHARE = {
            shareTitle: '【融资1V1暨氪空间9期项目抢先看】',
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
                activityName: vm.activityName
            });
        } else {
            getActivity();
        }
    }

    function getActivity() {
        var sendData = {
            activityName: vm.activityName
        };
        FindService.getActivity(sendData)
            .then(function (response) {
                vm.hasSubmit = response.data.hasSubmit;
                if (!vm.hasSubmit) {
                    $state.go('findInvestor', {
                        activityName: vm.activityName
                    });
                } else {
                    $state.go('findInvestorSuccess', {
                        activityName: vm.activityName
                    });
                }
            })
            .catch(error);
    }

    function error(err) {
        if (err.code === 403) {
            $state.go('findLogin', {
                activityName: vm.activityName
            });
        }
    }
}
