var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('BangdanOrgController', BangdanOrgController);

function BangdanOrgController(loading, $scope, $modal, $stateParams, FindService,
    $state, UserService, ErrorService, hybrid, $rootScope, $timeout, BangDanService) {

    var vm = this;
    vm.list = [];
    vm.page = 0;
    vm.more = false;
    vm.busy = false;
    vm.displayMore = displayMore;

    init();

    function init() {
        $('.J_commonHeaderWrapper').remove();
        getOrgRank();
    }

    function getOrgRank() {
        if (vm.busy) return;
        vm.busy = true;
        var request = {
            page: vm.page + 1,
            pageSize: 10,
        };
        BangDanService.getOrgRank(request)
            .then(function(response) {
                vm.list = vm.list.concat(response.data.data);
                if (response.data.totalPages) {
                    vm.page = response.data.page || 0;
                    if (response.data.totalPages !== vm.page && response.data.data.length > 0) {
                        vm.busy = false;
                    } else {
                        vm.finish = true;
                        vm.more = true;
                    }
                }
            }).catch(fail);
    }

    function displayMore() {
        console.log(1111111);
        getOrgRank();
    }

    function fail(err) {
        ErrorService.alert(err.err.msg);
    }

    $scope.abs = function(number) {
        return Math.abs(number);
    };
}