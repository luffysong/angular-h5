
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('HotSpotTabController', HotSpotTabController);

function HotSpotTabController(loading, $modal, FindService, $scope) {
    var vm = this;
    vm.responseData = [];
    vm.busy = false;
    vm.page = 0;
    var meetingStatus = [{
        label: '最新',
        value: 'NEW'
    }, {
        label: '最热',
        value: 'HOT'
    }, {
        label: '机构在融',
        value: 'FINANCING'
    }];
    $scope.status = meetingStatus;
    $scope.currentStatus = $scope.status[0].value;

    //更多
    vm.more = more;
    vm.loadData = loadData;

    init();

    function init() {
        document.title = '项目专辑';
        $('head').append('<meta name="format-detection" content="telephone=no" />');
        vm.currPos = 'NEW';
        loadData();
        initWeixin();
    }

    function loadData() {
        if (vm.currPos === 'NEW') {
            loadLateData();
        }else if (vm.currPos === 'FINANCING') {
            loadFinancingData();
        }else if (vm.currPos === 'HOT') {
            loadHotData();
        }
    }

    function initWeixin() {
        window.WEIXINSHARE = {
            shareTitle: '项目专辑',
            shareUrl: window.location.href,
            shareImg: 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png',
            shareDesc: '来「创投助手」，发现最新最热优质项目！',
            shareButton: 'hide'
        };
        var obj = {};
        window.InitWeixin(obj);
    }

    $scope.$on('tabClicked', function (e, item) {
        if (item.value === 'HOT') {
            loading.show('findLoading');
            resetData(item.value);
            loadHotData();
        }else if (item.value === 'FINANCING') {
            loading.show('findLoading');
            resetData(item.value);
            loadFinancingData();
        }else if (item.value === 'NEW') {
            loading.show('findLoading');
            resetData(item.value);
            loadLateData();
        }
    });

    function resetData(curr) {
        vm.responseData = [];
        vm.page = 0;
        vm.currPos = curr;
        vm.busy = false;
        vm.hasInit = false;
        vm.finish = false;
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

    function loadLateData() {
        if (vm.busy)return;
        vm.busy = true;

        var sendData = {
            page: vm.page + 1,
            pageSize: 10
        };
        FindService.getLatestList(sendData)
        .then(function (response) {
            loading.hide('findLoading');
            vm.hasInit = true;
            if (vm.responseData && vm.currPos === 'NEW') {
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

    function loadHotData() {
        if (vm.busy)return;
        vm.busy = true;

        var sendData = {
            page: vm.page + 1,
            pageSize: 10
        };

        FindService.getHottestList(sendData)
        .then(function (response) {
            loading.hide('findLoading');
            vm.hasInit = true;
            if (vm.responseData && vm.currPos === 'HOT') {
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

    function loadFinancingData() {
        if (vm.busy)return;
        vm.busy = true;

        var sendData = {
            page: vm.page + 1,
            pageSize: 10
        };

        FindService.getFundingList(sendData)
        .then(function (response) {
            vm.hasInit = true;
            loading.hide('findLoading');
            if (vm.responseData && vm.currPos === 'FINANCING') {
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
            } else {
                vm.finish = true;
            }
        });
    }

}
