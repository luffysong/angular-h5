var angular = require('angular');
angular.module('defaultApp.controller')
  .controller('InvestorController', InvestorController);

function InvestorController(loading, $stateParams, ActivityService, $state, UserService, ErrorService) {
    var vm = this;
    init();

    function init() {
        removeHeader();
        loading.hide('findLoading');
    }

    function removeHeader() {
        $('.common-header.J_commonHeaderWrapper').remove();
    }
}
