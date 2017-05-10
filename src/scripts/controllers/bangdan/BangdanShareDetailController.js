var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('BangdanShareDetailController', BangdanShareDetailController);

function BangdanShareDetailController(loading, $scope, $modal, $stateParams, FindService,
    $state, UserService, ErrorService, hybrid, $rootScope, $timeout, BangDanService) {

    var vm = this;
    vm.id = $stateParams.id;
    vm.rank = $stateParams.rank;
    init();

    function init() {
        $('.J_commonHeaderWrapper').remove();
        getSingleOrgInfo(vm.id);
    }

    function getSingleOrgInfo(id) {
        BangDanService.getSingleOrgInfo(id)
            .then(function (response) {
                vm.data = response.data;
                initTitle(vm.data.name);
            });
    }

    function initTitle(t) {
        document.title = t;
    }
}
