var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('BangdanOrgDetailController', BangdanOrgDetailController);

function BangdanOrgDetailController(loading, $scope, $modal, $stateParams,
    $state, UserService, BangDanService, ErrorService, hybrid, $rootScope, $timeout, orgInfo) {
    var vm = this;
    vm.joinpro = joinpro;
    vm.page = 0;
    vm.busy = false;
    vm.prolist = [];
    vm.more = false;
    vm.goProDetail = goProDetail;
    vm.rank = $stateParams.rank;

    init();

    function init() {
        vm.orgInfo = orgInfo.data;
        initTitle(vm.orgInfo.name);
        //initWeixin();
        getProList();
    }

    function getProList() {
        if (vm.busy) return;
        vm.busy = true;

        var params = {
            page: vm.page + 1,
            pageSize: 10,
        };

        BangDanService.getOrgProRank($stateParams.id, params)
        .then(function setdata(response) {
            vm.prolist = vm.prolist.concat(response.data.data);
            if (response.data.totalPages) {
                vm.page = response.data.page || 0;

                if (response.data.totalPages !== vm.page && response.data.data.length > 0) {
                    vm.busy = false;
                } else {
                    vm.finish = true;
                    vm.more = true;
                }
            }

        })
        .catch(fail);
    }

    function goProDetail(ccid) {
        if (ccid) {
            if (hybrid.isInApp) {
                hybrid.open('crmCompany/' + ccid);
            }else {
                var HOST = location.host;
                window.location.href = 'https://' + HOST + '/m/company.html?cid=' + ccid + '';
            }
        }
    }

    function initWeixin(name) {
        window.WEIXINSHARE = {
            shareTitle: '【创投助手·融资季】明星投资人' + name + '独家项目集，等你来掐尖儿。',
            shareUrl: window.location.href,
            krtou: 'weChatShare/' + $stateParams.id,
            shareImg: 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png',
            shareDesc: '明星携被投项目加入，每周二、三更新两场。',
        };

        var obj = {};
        window.InitWeixin(obj);
    }

    function initTitle(t) {
        document.title = t;
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
