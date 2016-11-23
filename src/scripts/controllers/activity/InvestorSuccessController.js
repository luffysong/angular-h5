
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('InvestorSuccessController', InvestorSuccessController);

function InvestorSuccessController($stateParams, FindService, $state, hybrid) {
    var vm = this;
    init();

    function init() {
        if (window.WEIXINSHARE && window.WEIXINSHARE.shareTitle) {
            document.title = window.WEIXINSHARE.shareTitle;
        }

        $('.header-banner-wrapper').css('display', 'flex');
        $('html').css('overflow', 'auto');
        $('body').css('overflow', 'auto');
        if (hybrid.isInApp) {
            $('.header-banner-wrapper').hide();
        }

        vm.activityName = $stateParams.activityName;
        if (typeof (vm.activityName) !== 'string' && vm.activityName[0]) {
            vm.activityName = vm.activityName[0];
        }

        if (window.parent.initCss) {
            $('html').css('overflow', 'hidden');
            $('body').css('overflow', 'hidden');
            $('.header-banner-wrapper').hide();
            window.parent.initCss && window.parent.initCss();
            window.parent.initFooter && window.parent.initFooter();
        }

        getActivity();
    }

    //查看是否参与过活动
    function getActivity() {
        var sendData = {
            activityName: vm.activityName
        };
        FindService.getActivity(sendData)
            .then(function (response) {
                vm.hasSubmit = response.data.hasSubmit;
                if (!vm.hasSubmit) {
                    $state.go('findLogin', {
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
