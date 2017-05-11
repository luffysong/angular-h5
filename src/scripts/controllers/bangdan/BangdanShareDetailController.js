var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('BangdanShareDetailController', BangdanShareDetailController);

function BangdanShareDetailController(loading, $scope, $modal, $stateParams, FindService,
    $state, UserService, ErrorService, hybrid, $rootScope, $timeout, BangDanService) {

    var vm = this;
    vm.id = $stateParams.id;
    vm.rank = $stateParams.rank;
    vm.bangdanOrg = bangdanOrg;
    vm.bangdanOrgDetail = bangdanOrgDetail;
    vm.inApp = false;
    init();

    function init() {
        if (hybrid.isInApp) {
            vm.inApp = true;
        }

        sa.track('ViewPage', {
                source: 'share_page',
                org_id: $stateParams.id + '',
                page: 'share_page',
            });

        $('.J_commonHeaderWrapper').remove();
        getSingleOrgInfo(vm.id);
        getQ();
    }

    function initWeixin(name, count, q, rank, logo) {
        window.WEIXINSHARE = {
            shareTitle: name + '排名第' + rank + '|2017Q' + q + '风口机构排行榜',
            shareUrl: window.location.href,
            shareImg: '' + logo + '',
            shareDesc: name + '' + count + '个投资项目都在这里',
        };

        var obj = {};
        window.InitWeixin(obj);
    }

    function getQ() {
        var myDate = new Date();
        var currMonth = myDate.getMonth(); //获取当前月份(0-11,0代表1月)
        var currQuarter = Math.floor((currMonth % 3 == 0 ? (currMonth / 3) : (currMonth / 3 + 1)));
        vm.currQuarter = currQuarter;
        initTitle('2017Q' + vm.currQuarter + '·风口机构排行榜');
    }

    function bangdanOrg() {
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
            source:'share_page',
            target:'org_top_list',
            org_id: $stateParams.id + '',
            client:client,
        });
        $state.go('bangdan.orgbd', {
        });
    }

    function bangdanOrgDetail(id, rank) {
        var isAndroid = !!navigator.userAgent.match(/android/ig);
        var isIos = !!navigator.userAgent.match(/iphone|ipod|ipad/ig);
        var client = 'H5';
        if (isAndroid) {
            client = 'Android';
        }else if (isIos) {
            client = 'iOS';
        }

        sa.track('ViewPage', {
                source: 'share_page',
                org_id: $stateParams.id + '',
                page: 'organization',
            });

        sa.track('OrgTopListClick',
          {
            source:'share_page',
            target:'organization',
            org_id: id + '',
            client:client,
        });
        $state.go('bangdan.orgbdDetail', {
            id: id,
            rank: rank,
        });
    }

    function getSingleOrgInfo(id) {
        BangDanService.getSingleOrgInfo(id)
            .then(function (response) {
                vm.data = response.data;
                initWeixin(vm.data.name, vm.data.projectCount, vm.currQuarter, vm.rank, vm.data.logo);
            });
    }

    function initTitle(t) {
        document.title = t;
    }
}
