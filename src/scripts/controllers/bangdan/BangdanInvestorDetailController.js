var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('BangdanInvestorDetailController', BangdanInvestorDetailController);

function BangdanInvestorDetailController(loading, $scope, $modal, $stateParams, FindService,
    $state, UserService, BangDanService, ErrorService, hybrid, $rootScope, $timeout) {
    var vm = this;
    vm.page = 0;
    vm.busy = false;

}
