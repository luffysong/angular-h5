var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('FinanceController', FinanceController);

function FinanceController(loading, FindService, ErrorService, $modal, hybrid, $timeout) {
    var vm = this;
    vm.sendData;

    vm.responseData = [];
    vm.timestamp = '';
    vm.filterLabelsAll;
    vm.filterLabelsArray = [];
    vm.busy = true;
    vm.sendArray = [];

    vm.link = link;
    vm.loadMore = loadMore;
    vm.filter = filter;

    init();

    function init() {
        document.title = '融资速递';
        $('head').append('<meta name="format-detection" content="telephone=no" />');
        loadData();
        initWeixin();
    }

    function initWeixin() {
        window.WEIXINSHARE = {
            shareTitle: '融资速递',
            shareUrl: window.location.href,
            shareImg: 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png',
            shareDesc: '来「36氪创投助手」，发现最新最热优质项目！',
            shareButton: 'hide'
        };
        var obj = {};
        window.InitWeixin(obj);
    }

    function loadData() {

        vm.sendArray = [];
        if (!vm.filterLabelsArray.length) {
            vm.sendData = {
                date: '',
                labels: ''
            };
        } else {
            for (var j = 1; j < vm.filterLabelsArray.length; j++) {
                if (vm.filterLabelsArray[j].active === true) {
                    vm.sendArray.push(vm.filterLabelsArray[j].label);
                }
            }

            vm.sendData = {
                date: '',
                labels: vm.sendArray.join(',')
            };
        }

        FindService.getFinanceList(vm.sendData)
            .then(function temp(response) {
                loading.hide('findLoading');
                vm.responseData = response.data.group.map(function (item, index) {
                    if (item.datas && item.datas.length) {
                        item.datas = structureData(item.datas);
                    }
                    if (item.ts === moment().format('YYYY-MM-DD')) {
                        item.structuredTs = '今天';
                    } else {
                        item.structuredTs = item.tsExpose;
                    }
                    return item;
                });
                setFilterLabels(response.data.filterLabels, 0);
                vm.sendData.date = response.data.ts;
                vm.busy = false;
                vm.hasInit = true;
                $('html, body').animate({
                    scrollTop: 0
                }, 200);
            })
            .catch(error);
    }

    function loadMore() {
        if (vm.busy) return;
        vm.busy = true;

        FindService.getFinanceList(vm.sendData)
            .then(function temp(response) {
                $timeout(function() {
                    var structuredData = response.data.group.map(function (item, index) {
                        if (item.datas && item.datas.length) {
                            item.datas = structureData(item.datas);
                        }
                        if (item.ts === moment().format('YYYY-MM-DD')) {
                            item.structuredTs = '今天';
                        } else {
                            item.structuredTs = item.tsExpose;
                        }
                        return item;
                    });
                    vm.responseData = vm.responseData.concat(structuredData);
                    vm.sendData.date = response.data.ts;
                    vm.busy = false;
                }, 1000);
            })
            .catch(error);
    }

    function structureData(data) {
        return data.map(function (item) {
            if (item.phase === '未融资') {
                item.phase = '';
            }
            if (item.amount === '未披露') {
                item.amount = '';
            }
            if (item.phase === '并购') {
                item.structuredTitle = '<span>' + item.name + '</span>被' + item.investors + (item.amount ? '以' + item.amount : '') + '并购';
            } else if (item.phase === '上市') {
                item.structuredTitle = '<span>' + item.name + '</span>上市';
            } else if (item.phase === '上市后') {
                item.structuredTitle = '<span>' + item.name + '</span>定增' + item.amount;
            } else if (item.phase === '新三板' || item.phase === '新四板') {
                item.structuredTitle = '<span>' + item.name + '</span>挂牌' + item.phase;
            } else {
                item.structuredTitle = '<span>' + item.name + '</span>获' + item.phase + item.amount + '投资';
            }
            if (item.exposeDate === moment().format('YYYY-MM-DD')) {
                item.structuredDate = '今天';
            } else {
                item.structuredDate = item.exposeDate;
            }
            return item;
        });
    }

    function error(err) {
        ErrorService.alert(err);
    }

    function setFilterLabels(data, time) {

        //第一次初始化全部行业,else是在全部中筛选
        if (!time) {
            var object;

            vm.filterLabelsArray = [{
                active: true,
                label: '全部',
            }];
            for (var i = 0; i < data.length; i++) {
                object = {
                    active: false,
                    label: data[i],
                };
                vm.filterLabelsArray.push(object);
            }

            //设置默认选中
            if (vm.sendArray.length) {
                vm.filterLabelsArray[0].active = false;
                for (var m = 0; m < vm.sendArray.length; m++) {
                    for (var n = 0; n < vm.filterLabelsArray.length; n++) {
                        if (vm.sendArray[m] === vm.filterLabelsArray[n].label) {
                            vm.filterLabelsArray[n].active = true;
                            break;
                        }
                    }
                }
            }

            vm.filterLabelsAll = angular.copy(vm.filterLabelsArray);
        } else {
            vm.filterLabelsArray = angular.copy(vm.filterLabelsAll);

            //筛选不为空
            if (data.length) {
                vm.filterLabelsArray[0].active = false;
                for (var j = 1; j < vm.filterLabelsArray.length; j++) {
                    for (var k = 0; k < data.length; k++) {
                        if (vm.filterLabelsArray[j].label === data[k]) {
                            vm.filterLabelsArray[j].active = true;
                            break;
                        }

                        vm.filterLabelsArray[j].active = false;
                    }
                }
            } else {
                vm.filterLabelsArray = [];
            }

        }
    }

    function filter(e) {
        e.preventDefault();
        $modal.open({
            templateUrl: 'templates/find/financeFilter.html',
            windowClass: 'nativeAlert_wrap',
            controller: modalController,
            controllerAs: 'vm',
            resolve: {
                obj: function () {
                    return vm.filterLabelsArray;
                }
            }
        }).result.then(loadData).catch(loadData);
    }

    modalController.$inject = ['$modalInstance', 'obj'];

    function modalController($modalInstance, obj) {

        var vm = this;
        vm.array = angular.copy(obj);
        vm.cancel = cancel;
        vm.object = {};
        vm.filterArray = [];

        vm.itemClick = itemClick;
        vm.rollBack = rollBack;
        vm.submit = submit;

        init();

        function init() {
            if (vm.array[0].active === false) {
                for (var j = 1; j < vm.array.length; j++) {
                    if (vm.array[j].active === true) {
                        vm.filterArray.push(vm.array[j].label);
                    }
                }
            }

            filterCount();

        }

        function itemClick(item, event) {
            vm.filterArray = [];
            event.preventDefault();
            if (item.label === '全部') {
                for (var i = 1; i < vm.array.length; i++) {
                    vm.array[i].active = false;
                }

                vm.array[0].active = true;
            } else {
                vm.array[0].active = false;
                item.active = !item.active;
                for (var j = 1; j < vm.array.length; j++) {
                    if (vm.array[j].active === true) {
                        vm.filterArray.push(vm.array[j].label);
                    }
                }

                if (!vm.filterArray.length) {
                    vm.array[0].active = true;
                }
            }

            filterCount();

        }

        function filterCount() {
            var sendData;

            if (!vm.filterArray.length) {
                sendData = {
                    labels: ''
                };
            } else {
                sendData = {
                    labels: vm.filterArray.join(',')
                };
            }

            FindService.getFilterCount(sendData)
                .then(function temp(response) {
                    vm.proNum = response.data.count;
                })
                .catch(error);
        }

        function cancel() {
            $modalInstance.dismiss();
        }

        function submit() {
            setFilterLabels(vm.filterArray, 1);
            $modalInstance.dismiss();
        }

        function rollBack() {
            vm.array = angular.copy(obj);
            for (var i = 1; i < vm.array.length; i++) {
                vm.array[i].active = false;
            }

            vm.array[0].active = true;
            vm.filterArray = [];
            init();
        }
    }

    function link(ccid, link, event) {
        event.preventDefault();
        event.stopPropagation();
        hybrid.open('addBottomViewInWeb/' + ccid);
        window.setTimeout(function () {
            window.location.href = link;
        }, 200);
    }
}
