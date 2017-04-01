var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('ProjectAlbumController', ProjectAlbumController);

function ProjectAlbumController(demosService, projectColumnService, $state, $stateParams, loading, ErrorService, FindService, $modal) {
    var vm = this;
    $('body').css({
        backgroundColor: '#fff'
    });
    // URL 参数
    vm.params = {
        type: $stateParams.type,
    };
    vm.type = $stateParams.type;
    // 页面 title
    switch (vm.params.type) {
        case 'latest':
            document.title = '最新';
            vm.title = '最新';
            vm.id = 160;
            break;
        case 'hotest':
            document.title = '最热';
            vm.title = '最热';
            vm.id = 160;
            break;
        case 'funding':
            document.title = '机构在融';
            vm.title = '机构在融';
            vm.id = 160;
            break;
    }

    vm.responseData = [];
    vm.busy = false;
    vm.page = 0;

    //更多
    vm.more = more;
    vm.loadData = loadData;

    vm.setTrack = function (evtName, obj) {
        console.log(evtName, obj);
        sa.track(evtName, obj);
    }

    init();
    function init() {
        $('html').css('overflow', '');
        $('body').css('overflow', '');
        document.title = vm.title;
        $('head').append('<meta name="format-detection" content="telephone=no" />');
        vm.type = $stateParams.type;
        loadData();
        initWeixin();
    }
    loading.show('findLoading');
    function loadData() {
        if (vm.type === 'latest') {
            loadLateData();
        }else if (vm.type === 'funding') {
            loadFinancingData();
        }else if (vm.type === 'hotest') {
            loadHotData();
        }
    }

    function initWeixin() {
        window.WEIXINSHARE = {
            shareTitle: vm.title,
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
                if (vm.responseData && vm.type === 'latest') {
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
                if (vm.responseData && vm.type === 'hotest') {
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
                loading.hide('findLoading');
                vm.hasInit = true;
                if (vm.responseData && vm.type === 'funding') {
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

