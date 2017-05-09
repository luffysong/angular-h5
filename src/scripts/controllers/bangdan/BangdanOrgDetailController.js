var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('BangdanOrgDetailController', BangdanOrgDetailController);

function BangdanOrgDetailController(loading, $scope, $modal, $stateParams,
    $state, UserService, BangDanService, ErrorService, hybrid, $rootScope, $timeout, orgInfo) {
    var vm = this;
    vm.joinpro = joinpro;
    vm.page = 0;

    init();

    function init() {

    }

    function getProList() {
        var params = {
            id: $stateParams.id,
            page: vm.page + 1,
            pageSize: 10,
        };

        BangDanService.getOrgProRank(params)
        .then(function setdata(data) {

        })
        .catch(fail);
    }

    function joinpro(item) {
        item = item ? item : {};
        $modal.open({
                templateUrl: 'templates/bangdan/shareWin.html',
                windowClass: 'bd-nativeAlert_wrap',
                controller: defaultController,
                controllerAs: 'vm',
                resolve: {
                    obj: function () {
                        return item;
                    }
                }
            });
    }

    defaultController.$inject = ['$modalInstance', 'obj'];

    function defaultController($modalInstance, obj) {

        var vm = this;
        vm.cancelModal = cancelModal;

        function cancelModal() {
            $modalInstance.dismiss();
        }
    }

    function fail(err) {
        if (err.code === '403') {
            console.log(err.msg);
        } else if (err.code === '1') {
            ErrorService.alert(err.msg);
        }
    }

}
