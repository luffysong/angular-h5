var angular = require('angular');
angular.module('defaultApp.controller')
  .controller('OrganizationController', OrganizationController);

function OrganizationController(loading, $stateParams, RongziService, $state, UserService, ErrorService) {
    var vm = this;
    init();
    function init() {
        console.log($stateParams.id);
        loading.hide('findLoading');
        removeHeader();
        initData();
        console.log(UserService.getUID());
    }

    function initData() {
        RongziService.getOrg({ id: $stateParams.id })
            .then(function setCommunity(data) {
                    vm.result = data.data.data;
                    vm.beforeA = [];
                    vm.afterA = [];

                    angular.forEach(data.data.data.sessions,
                      function (dt, index, array) {
                        if (dt.projectCategory === 1) {
                            vm.afterA.push(dt);
                        } else if (dt.projectCategory === 0) {
                            vm.beforeA.push(dt);
                        }
                    });

                    initTitle(vm.result.title);
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
