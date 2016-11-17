
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('HotSpotController', HotSpotController);

function HotSpotController(loading, $modal, FindService) {
    var vm = this;
    vm.responseData = [];
    vm.busy = false;
    vm.page = 0;

    //更多
    vm.more = more;
    vm.loadData = loadData;

    init();

    function init() {
        document.title = '投资热点';
        $('head').append('<meta name="format-detection" content="telephone=no" />');
        loading.hide('findLoading');
        loadData();
        initWeixin();
    }

    function initWeixin() {
        window.WEIXINSHARE = {
            shareTitle: '投资热点',
            shareUrl: window.location.href,
            shareImg: 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png',
            shareDesc: '来「36氪创投助手」，发现最新最热优质项目！',
            shareButton: 'hide'
        };
        var obj = {};
        window.InitWeixin(obj);
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
        });
    }

    modalController.$inject = ['$modalInstance', 'obj', 'hybrid'];
    function modalController($modalInstance, obj, hybrid) {

        var vm = this;
        vm.item = obj;
        vm.ktm_source = 'hot_more';
        vm.cancel = cancel;

        function cancel() {
            $modalInstance.dismiss();
        }
    }

    function loadData() {
        if (vm.busy)return;
        vm.busy = true;

        var sendData = {
            page: vm.page + 1,
            pageSize: 10
        };
        FindService.getHotSpotList(sendData)
        .then(function (response) {
            vm.hasInit = true;
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
