var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('FrStartupSuccessController', FrStartupSuccessController);

function FrStartupSuccessController($stateParams, FindService, $state, hybrid, ActivityService) {
    var vm = this;
    vm.bothh3 = false;
    vm.investorh3 = false;
    vm.startuph3 = false;
    init();

    function init() {

        // if (window.WEIXINSHARE && window.WEIXINSHARE.shareTitle) {
        //     document.title = window.WEIXINSHARE.shareTitle;
        // }

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

        if (vm.activityName) {
            $('#openApp').attr('href', 'https://36kr.com/app/tou?ktm_source=investorSuccess.' + vm.activityName);
        }

        if (window.parent.initCss) {
            $('html').css('overflow', 'hidden');
            $('body').css('overflow', 'hidden');
            $('.header-banner-wrapper').hide();
            window.parent.initCss && window.parent.initCss();
            window.parent.initFooter && window.parent.initFooter();
        }

        getActivity();
        initH3();
    }

    //查看是否参与过活动
    function getActivity() {
        ActivityService.startUpState(vm.activityName)
            .then(function (response) {
                vm.hasSubmit = !response.data.applied;
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

    function initH3() {
        vm[document.title.toLowerCase() + 'h3'] = true;
    }
}
