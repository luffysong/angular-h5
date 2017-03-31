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
                    vm.investors = [];
                    angular.forEach(data.data.data.sessions,
                      function (dt, index, array) {
                        var nameArr = dt.name.split('');
                        dt.nameArr = nameArr;
                        vm.investors.push(dt);
                    });

                    initTitle(vm.result.title);
                }).catch((err) => {
                        fail(err);
                    });
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
