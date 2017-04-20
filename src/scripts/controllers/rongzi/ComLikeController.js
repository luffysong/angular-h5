var angular = require('angular');
angular.module('defaultApp.controller')
  .controller('ComLikeController', ComLikeController);

function ComLikeController($document, $timeout, $scope, $modal, loading, $stateParams,
  RongziService, FindService, $state, UserService, ErrorService, hybrid) {
    var vm = this;
    vm.needApp = true;
    vm.tabChange = tabChange;
    vm.Aafter = false;
    vm.Abefore = true;

    init();

    function init() {
        if (!hybrid.isInApp) {
            vm.needApp = false;
        }

        initData();
        initWeixin();
        initTitle();
    }

    function initTitle() {
        document.title = '融资季 · 投资人最喜爱的社群排行榜';
    }

    function initWeixin() {
        window.WEIXINSHARE = {
            shareTitle: '【创投助手 · 融资季】项目的名义！融资季最受欢迎创业社群！',
            shareUrl: window.location.href,
            shareImg: 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png',
            shareDesc: '创投助手融资季 “投资人最喜爱的社群排行榜”火热出炉！',
        };

        var obj = {};
        window.InitWeixin(obj);
    }

    function tabChange(e) {
        var obj = angular.element(e.currentTarget);
        var id = obj.attr('id');
        obj.parent().children().removeClass('tab-comm-selected');
        obj.addClass('tab-comm-selected');
        if ('AAfter' === id) {
            vm.Aafter = true;
            vm.Abefore = false;
            initData('1');
        } else if (('ABefore') === id) {
            vm.Aafter = false;
            vm.Abefore = true;
            initData('0');
        }
    }

    function initData(projectCategory) {
        var senddata = {
            projectCategory:projectCategory ? parseInt(projectCategory) : 0,
        };
        RongziService.getComLike(senddata)
            .then(function setCommunity(data) {
                    if (data.data) {
                        vm.result = data.data;
                    }
                }).catch(fail);
    }

    function fail(err) {
        ErrorService.alert(err.msg);
    }
}
