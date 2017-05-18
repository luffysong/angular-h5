var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('BangdanInvestorDetailController', BangdanInvestorDetailController);

function BangdanInvestorDetailController(loading, $scope, $modal, $stateParams, FindService,
    $state, UserService, BangDanService, ErrorService, hybrid, $rootScope, $timeout) {
    var vm = this;
    vm.page = 0;
    vm.busy = false;
    vm.prolist = [];
    vm.rank = '1';
    vm.intro = '而我却二而我却二而我却二我却二我却二我却二我却二我却二我却二我却二我却二我却二我却二我却二我却二我却二我却二我却二我却二我却二我却二我却二我却二我却二我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二';
    init();

    function init() {
        getProList();
    }

    function getProList() {
        if (vm.busy) return;
        vm.busy = true;

        var params = {
            page: vm.page + 1,
            pageSize: 10,
        };

        BangDanService.getOrgProRank($stateParams.id, params)
        .then(function setdata(response) {
            vm.startloading = false;
            loading.hide('bangdanDetailLoading');
            vm.prolist = vm.prolist.concat(response.data.data);
            if (response.data.totalPages) {
                vm.page = response.data.page || 0;

                if (response.data.totalPages !== vm.page && response.data.data.length > 0) {
                    vm.busy = false;
                } else {
                    vm.finish = true;
                    vm.more = true;
                }
            }

        })
        .catch(fail);
    }

    function fail(err) {
        loading.hide('bangdanDetailLoading');
        if (err.code === '403') {
            console.log(err.msg);
        } else if (err.code === '1') {
            ErrorService.alert(err.msg);
        }
    }

}
