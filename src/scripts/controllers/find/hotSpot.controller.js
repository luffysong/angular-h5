
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('HotSpotController', HotSpotController);

function HotSpotController(loading, $modal, FindService) {
    var vm = this;
    vm.responseData = [];
    vm.busy = false;
    vm.page = 1;

    //更多
    vm.more = more;
    vm.loadData = loadData;

    init();

    function init() {
        document.title = '投资热点';
        loading.hide('demos');
        loadData();
    }

    function more(item, e) {
        e.preventDefault();
        e.stopPropagation();
        $modal.open({
            templateUrl: 'templates/find/nativeAlert.html',
            windowClass: 'nativeAlert_wrap',
            controller: modalController,
            controllerAs: 'vm',
            resolve: {
                obj: function () {
                    return item;
                }
            }
        }).result.then(allowScroll).catch(allowScroll);
    }

    function allowScroll() {
        window.removeEventListener('touchmove', preventDefault, false);
    }

    modalController.$inject = ['$modalInstance', 'obj', 'hybrid'];
    function modalController($modalInstance, obj, hybrid) {

        var vm = this;
        vm.item = obj;
        vm.cancel = cancel;
        vm.open = open;

        function cancel() {
            $modalInstance.dismiss();
        }

        function open() {
            var path = 'projectsSet/' + obj.id + '?ktm_source=hotSpot';
            if (hybrid.isInApp) {
                hybrid.open(path);
                $modalInstance.dismiss();
            }
        }

        window.addEventListener('touchmove', preventDefault, false);
    }

    function preventDefault() {
        event.preventDefault();
    }

    function loadData() {
        if (vm.busy)return;
        vm.busy = true;

        var sendData = {
            page: vm.page,
            pageSize: 10
        };
        FindService.getHotSpotList(sendData)
        .then(function (response) {
            if (vm.responseData) {
                vm.responseData = vm.responseData.concat(response.data.data);
            } else {
                vm.responseData = response.data.data;
            }

            if (response.data.totalPages) {
                vm.page = response.data.page || 0;
                if (response.data.totalPages !== vm.page) {
                    vm.busy = false;
                } else {
                    vm.finish = true;
                }
            }
        });
    }
}
