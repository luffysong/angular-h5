var angular = require('angular');
angular.module('defaultApp.controller')
  .controller('ShareController', ShareController);

function ShareController(loading, $stateParams, RongziService, $state, UserService, ErrorService) {
    var vm = this;
    vm.project = [];
    vm.liked = false;
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
            window.location.href = vm.openUrl;
        } else if (!UserService.getUID()) {
            window.location.href = 'https://passport.36kr.com/pages';
        } else if (UserService.getUID() && hybrid.isInApp) {
            RongziService.like(id)
                .then(function (response) {
                    vm.project.like = response.data.curCount;
                });
        }
    }
}
