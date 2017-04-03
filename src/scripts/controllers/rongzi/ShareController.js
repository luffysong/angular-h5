var angular = require('angular');
angular.module('defaultApp.controller')
  .controller('ShareController', ShareController);

function ShareController(loading, $stateParams, RongziService, $state, UserService, ErrorService) {
    var vm = this;
    vm.project = [];
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
}
