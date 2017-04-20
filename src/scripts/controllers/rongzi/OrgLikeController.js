var angular = require('angular');
angular.module('defaultApp.controller')
  .controller('OrgLikeController', OrgLikeController);

function OrgLikeController($document, $timeout, $scope, $modal, loading, $stateParams,
  RongziService, FindService, $state, UserService, ErrorService, hybrid) {
    var vm = this;
    vm.needApp = true;
    vm.category = $stateParams.category;

    init();

    function init() {
        if (!hybrid.isInApp) {
            vm.needApp = false;
        }

        initData();
        initTitle();
        initWeixin();
    }

    function initTitle() {
        document.title = '融资季 · 投资人最喜爱的机构排行榜';
    }

    function initWeixin() {
        window.WEIXINSHARE = {
            shareTitle: '【创投助手 · 融资季】项目的名义！融资季最受欢迎顶级机构！',
            shareUrl: window.location.href,
            shareImg: 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png',
            shareDesc: '创投助手融资季 “投资人最喜爱的机构排行榜”火热出炉！',
        };

        var obj = {};
        window.InitWeixin(obj);
    }

    function initData() {
        RongziService.getOrgLike()
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
