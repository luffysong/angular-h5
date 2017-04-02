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
        console.log($stateParams.id);
        RongziService.shareInfo($stateParams.id)
            .then(data => {
                console.log(data.data);
                vm.project = data.data;
            }).catch(fail);
    }

    function shareCompany() {
        // RongziService.share({ id: $stateParams.id })
        //     .then(function setCommunity(data) {
        //         vm.result = data.data.data;
        //         console.log(data);
        //         initTitle(vm.result.title);
        //     }).catch((err) => {
        //         fail(err);
        //     });
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
