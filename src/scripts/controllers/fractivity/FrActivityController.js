
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('FrActivityController', FrActivityController);

function FrActivityController($stateParams, ActivityService, $state, UserService, ErrorService) {
    var vm = this;
    vm.activity;
    vm.activityName = $stateParams.activityName;
    vm.start = start;
    vm.bothh3 = false;
    vm.investorh3 = false;
    vm.startuph3 = false;

    //vm.signUp = signUp;

    init();

    function init() {
        removeHeader();
        getActivity();
        $('html').css('overflow', 'auto');
        $('body').css('overflow', 'auto');
    }

    function initWeixin() {
        window.WEIXINSHARE = {
            shareTitle: '36氪融资',
            shareUrl: window.location.href,
            shareImg: 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png',
            shareDesc: '来「创投助手」，发现最新最热优质项目！',
        };

        if (vm.activity.wxShareDesc) {
            window.WEIXINSHARE.shareDesc = vm.activity.wxShareDesc;
        }

        if (vm.activity.wxShareImgUrl) {
            window.WEIXINSHARE.shareImg = vm.activity.wxShareImgUrl;
        }

        if (vm.activity.wxShareTitle) {
            window.WEIXINSHARE.shareTitle = vm.activity.wxShareTitle;
        }

        if (vm.activity.actName) {
            document.title = vm.activity.actName;
        }

        if (vm.activity.applierType) {
            document.applierType = vm.activity.applierType;
        }

        var obj = {};
        window.InitWeixin(obj);
        initH3();
    }

    //查看是否参与过活动
    function start(param) {
        if (!UserService.getUID()) {
            if (param === 'startup') {
                $state.go('findLogin', {
                    activityName: vm.activityName,
                    type: 'startup'
                });
            } else if (param === 'investor') {
                $state.go('findLogin', {
                    activityName: vm.activityName,
                    type: 'investor'
                });
            }
        } else {
            if (param === 'startup') {
                startUpState();
            } else if (param === 'investor') {
                investorState();
            }
        }
    }

    function getActivity() {
        ActivityService.actInfo(vm.activityName)
            .then(function (response) {
                console.log(response);
                vm.activity = response.data;
                initWeixin();
            })
            .catch(error);
    }

    function error(err) {
        if (err.code === 403) {
            $state.go('findLogin', {
                activityName: vm.activityName
            });
        } else {
            ErrorService.alert(err);
        }
    }

    function removeHeader() {
        $('.common-header.J_commonHeaderWrapper').remove();
    }

    // function signUp(param) {
    //     if (param === 'startup') {
    //         startUpState();
    //     } else if (param === 'investor') {
    //         investorState();
    //     }
    // }

    function startUpState() {
        ActivityService.startUpState(vm.activityName)
            .then(function (response) {
                if (!response.data.applied) {
                    $state.go('findStartUp', {
                        activityName: vm.activityName,
                        type: 'startup'
                    });
                } else {
                    $state.go('findStartUpSuccess', {
                        activityName: vm.activityName,
                        type: 'startup'
                    });
                }
            })
            .catch(error);
    }

    function investorState() {
        ActivityService.investorState(vm.activityName)
            .then(function (response) {
                if (!response.data.applied) {
                    $state.go('frInvestor', {
                        activityName: vm.activityName,
                        type: 'investor'
                    });
                } else {
                    $state.go('frInvestorSuccess', {
                        activityName: vm.activityName,
                        type: 'investor'
                    });
                }
            })
            .catch(error);
    }

    function initH3() {
        if (document.applierType) {
            vm[document.applierType.toLowerCase() + 'h3'] = true;
        }
    }
}
