
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('ActivityIndexController', ActivityIndexController);

function ActivityIndexController($stateParams, FindService, $state, UserService, ErrorService) {
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
            shareTitle: '36氪融资',
            shareUrl: window.location.href,
            shareImg: 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png',
            shareDesc: '来「36氪创投助手」，发现最新最热优质项目！',
        };

        //根据不同活动activityName设置不同title
        if (vm.activityName === 'krspace20161123') {
            window.WEIXINSHARE.shareTitle = '【融资1V1暨氪空间9期项目抢先看】';
        } else if (vm.activityName === 'wise20161124') {
            window.WEIXINSHARE.shareTitle = '【WISE*36氪创投助手  免费票 限量抢】';
        } else if (vm.activityName === 'ideaBank20161125') {
            window.WEIXINSHARE.shareTitle = '创投助手 x 赛石杯第三届IdeaBank全国泛大学生创业大赛';
        } else if (vm.activityName === 'wonderland20161205') {
            window.WEIXINSHARE.shareTitle = '36氪创投助手*WISE，来史上最炫娃娃机领取最搞怪“娃娃”！胆大者来！';
        } else if (vm.activityName === 'musicRoadshow20161206') {
            window.WEIXINSHARE.shareTitle = '第四届中国音乐产业大会投融资项目路演-36氪创投助手独家招募投资人';
        }

        var obj = {};
        window.InitWeixin(obj);
    }

    //查看是否参与过活动
    function start() {

        if (!UserService.getUID()) {
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
        } else {
            ErrorService.alert(err);
        }
    }
}
