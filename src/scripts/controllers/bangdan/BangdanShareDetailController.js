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
        getQ();
    }

    function getQ() {
        var myDate = new Date();
        var currMonth = myDate.getMonth(); //获取当前月份(0-11,0代表1月)
        var currQuarter = Math.floor((currMonth % 3 == 0 ? (currMonth / 3) : (currMonth / 3 + 1)));
        vm.currQuarter = currQuarter;
        initTitle('2017Q' + vm.currQuarter + '·风口机构排行榜');
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
