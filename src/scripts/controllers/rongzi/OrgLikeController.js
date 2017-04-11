var angular = require('angular');
angular.module('defaultApp.controller')
  .controller('OrgLikeController', OrgLikeController);

function OrgLikeController($document, $timeout, $scope, $modal, loading, $stateParams,
  RongziService, FindService, $state, UserService, ErrorService, hybrid) {
    var vm = this;
    vm.needApp = true;
    vm.category = $stateParams.category;

    init();

    function init() {
        if (!hybrid.isInApp) {
            vm.needApp = false;
        }

        initData();
    }

    function initData() {
        RongziService.getOrgLike()
            .then(function setCommunity(data) {
                    if (data.data) {
                        vm.result = data.data;
                    }
                }).catch(fail);
    }

    function fail(err) {
        ErrorService.alert(err.msg);
    }
}
