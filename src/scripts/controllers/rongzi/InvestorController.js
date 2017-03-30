var angular = require('angular');
angular.module('defaultApp.controller')
  .controller('InvestorController', InvestorController);

function InvestorController(loading, $stateParams, RongziService, $state, UserService, ErrorService) {
    var vm = this;
    init();

    function init() {
        console.log($stateParams.id);
        removeHeader();
        initData();
        loading.hide('findLoading');
    }

    function initData() {
        RongziService.getInvestor({ id: $stateParams.id })
            .then(function setCommunity(data) {
                    vm.result = data.data.data;
                    console.log(data);
                }).catch((err) => {
                        fail(err);
                    });
    }

    function fail(err) {
        ErrorService.alert(err.err.msg);
    }

    function removeHeader() {
        $('.common-header.J_commonHeaderWrapper').remove();
    }
}
