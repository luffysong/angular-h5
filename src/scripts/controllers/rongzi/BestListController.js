var angular = require('angular');
angular.module('defaultApp.controller')
  .controller('BestListController', BestListController);

function BestListController(loading, $stateParams, RongziService, $state, UserService, ErrorService) {
    var vm = this;
    vm.displayMore = displayMore;
    vm.page = 0;
    vm.prolist = [];
    init();
    function init() {
        removeHeader();
        loading.hide('findLoading');
        initData();
    }

    function removeHeader() {
        $('.common-header.J_commonHeaderWrapper').remove();
    }

    function initData() {
        console.log('===', vm.page);
        var sendata = {
            page: vm.page + 1,
            pageSize:10,
        };
        console.log(sendata);
        RongziService.getProList(sendata)
            .then(function setProList(response) {
                    console.log(response.data);
                    vm.prolist = vm.prolist.concat(response.data.data);

                    if (response.data.totalPages) {
                        vm.page = response.data.page || 0;
                        if (response.data.totalPages !== vm.page) {
                            vm.busy = false;
                        } else {
                            vm.finish = true;
                        }
                    }
                }).catch(fail);
    }

    function displayMore() {
        initData();
    }

    function initTitle(t) {
        document.title = t;
    }

    function fail(err) {
        ErrorService.alert(err.err.msg);
    }
}
