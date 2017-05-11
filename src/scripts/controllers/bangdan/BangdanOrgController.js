var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('BangdanOrgController', BangdanOrgController);

function BangdanOrgController(loading, $scope, $modal, $stateParams, FindService,
    $state, UserService, ErrorService, hybrid, $rootScope, $timeout, BangDanService) {

    var vm = this;
    vm.list = [];
    vm.page = 0;
    vm.more = false;
    vm.busy = false;
    vm.displayMore = displayMore;
    vm.goOrgDetail = goOrgDetail;
    vm.joinOrg = joinOrg;
    vm.total;

    init();

    function init() {
        sa.track('ViewPage', {
                source: 'org_top_list',
                page: 'org_top_list',
            });

        $('.J_commonHeaderWrapper').remove();
        getQ();
        getOrgRank();
    }

    function getQ() {
        var myDate = new Date();
        var currMonth = myDate.getMonth(); //获取当前月份(0-11,0代表1月)
        var currQuarter = Math.floor((currMonth % 3 == 0 ? (currMonth / 3) : (currMonth / 3 + 1)));
        vm.currQuarter = currQuarter;
        initTitle('2017Q' + vm.currQuarter + '·风口机构排行榜');
    }

    function initWeixin(q, count) {
        window.WEIXINSHARE = {
            shareTitle: '2017Q' + q + '风口机构排行榜，已有' + count + '家机构加入',
            shareUrl: window.location.href,
            shareImg: 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png',
            shareDesc: '所有机构被投项目都在这里',
        };

        var obj = {};
        window.InitWeixin(obj);
    }

    function initTitle(t) {
        document.title = t;
    }

    function getOrgRank() {
        if (vm.busy) return;
        vm.busy = true;
        var request = {
            page: vm.page + 1,
            pageSize: 10,
        };
        BangDanService.getOrgRank(request)
            .then(function (response) {
                vm.list = vm.list.concat(response.data.data);
                if (!vm.total) {
                    vm.total = response.data.totalCount;
                    initWeixin(vm.currQuarter, vm.total);
                }

                if (response.data.totalPages) {
                    vm.page = response.data.page || 0;
                    if (response.data.totalPages !== vm.page && response.data.data.length > 0) {
                        vm.busy = false;
                    } else {
                        vm.finish = true;
                        vm.more = true;
                    }
                }
            }).catch(fail);
    }

    function goOrgDetail(id, rank) {
        var isAndroid = !!navigator.userAgent.match(/android/ig);
        var isIos = !!navigator.userAgent.match(/iphone|ipod|ipad/ig);
        var client = 'H5';
        if (isAndroid) {
            client = 'Android';
        }else if (isIos) {
            client = 'iOS';
        }

        sa.track('OrgTopListClick',
          {
            source:'org_top_list',
            target:'organization',
            org_id:id,
            client:client,
        });

        $state.go('bangdan.orgbdDetail', {
            id: id,
            rank: rank,
        });
    }

    function displayMore() {
        getOrgRank();
    }

    function fail(err) {
        ErrorService.alert(err.err.msg);
    }

    $scope.abs = function (number) {
        return Math.abs(number);
    };

    function joinOrg() {
        var isAndroid = !!navigator.userAgent.match(/android/ig);
        var isIos = !!navigator.userAgent.match(/iphone|ipod|ipad/ig);
        var client = 'H5';
        if (isAndroid) {
            client = 'Android';
        }else if (isIos) {
            client = 'iOS';
        }

        sa.track('OrgTopListClick',
          {
            source:'org_top_list',
            target:'join_org_top_list',
            client:client,
        });
        window.location.href = 'http://cn.mikecrm.com/70INKZM';
    }
}
