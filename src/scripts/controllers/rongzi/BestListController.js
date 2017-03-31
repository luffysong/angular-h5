var angular = require('angular');
angular.module('defaultApp.controller')
  .controller('BestListController', BestListController);

function BestListController(loading, $stateParams, RongziService, $state, UserService, ErrorService) {
    var vm = this;
    init();
    function init() {
        removeHeader();
        loading.hide('findLoading');
        initData();
    }

    function removeHeader() {
        $('.common-header.J_commonHeaderWrapper').remove();
    }

    function initData() {
        RongziService.getProList({ page:1, pageSize:10 })
            .then(function setProList(data) {
                    console.log(data);
                    vm.prolist = data.data;
                }).catch(fail);
    }

    function initTitle(t) {
        document.title = t;
    }

    function fail(err) {
        ErrorService.alert(err.err.msg);
    }
}
