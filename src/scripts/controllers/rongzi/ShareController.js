var angular = require('angular');
angular.module('defaultApp.controller')
  .controller('ShareController', ShareController);

function ShareController(loading, $stateParams, RongziService, $state, UserService, ErrorService, hybrid) {
    var vm = this;
    vm.project = [];
    vm.liked = false;
    vm.like = like;
    init();

    function init() {
        removeHeader();
        initData();
        loading.hide('findLoading');
    }

    function initData() {
        RongziService.shareInfo($stateParams.id)
            .then(function (response) {
                vm.project = response.data;
            }).catch(fail);
    }

    function initTitle(t) {
        document.title = t;
    }

    function fail(err) {
        ErrorService.alert(err.err.msg);
    }

    function removeHeader() {
        $('.common-header.J_commonHeaderWrapper').remove();
    }

    function like(id) {
        if (!hybrid.isInApp) {
            console.log(111111);
            window.location.href = vm.openUrl;
        } else if (!UserService.getUID()) {
            console.log(2222222);
            window.location.href = 'https://passport.36kr.com/pages';
        } else if (UserService.getUID() && hybrid.isInApp) {
            console.log(33333333);
            RongziService.like(id)
                .then(function (response) {
                    vm.project.likes = response.data.curCount;
                    vm.project.liked = true;
                });
        }
    }
}
