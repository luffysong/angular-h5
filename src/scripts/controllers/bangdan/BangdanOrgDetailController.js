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
    vm.displayMore = displayMore;
    vm.rank = $stateParams.rank;

    init();

    function init() {
        sa.track('ViewPage', {
                source: 'organization',
                org_id: $stateParams.id,
                page: 'organization',
            });

        vm.orgInfo = orgInfo.data;
        getProList();
        getQ();
        var HOST = location.host;
        var shareUrl =
        'https://' + HOST + '/m/#/bangdan/bdshare?id=' + $stateParams.id + '&rank=' + $stateParams.rank;
        initWeixin(vm.orgInfo.name, vm.orgInfo.projectCount, vm.currQuarter, vm.rank, shareUrl, vm.orgInfo.logo);
    }

    function getQ() {
        var myDate = new Date();
        var currMonth = myDate.getMonth(); //获取当前月份(0-11,0代表1月)
        var currQuarter = Math.floor((currMonth % 3 == 0 ? (currMonth / 3) : (currMonth / 3 + 1)));
        vm.currQuarter = currQuarter;
        initTitle('2017Q' + vm.currQuarter + '·风口机构排行榜');
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

    function displayMore() {
        getProList();
    }

    function goProDetail(ccid) {
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
            source:'organization',
            target:'company',
            org_id:$stateParams.id,
            company_id:ccid,
            client:client,
        });

        if (ccid) {
            if (hybrid.isInApp) {
                hybrid.open('crmCompany/' + ccid);
            }else {
                var HOST = location.host;
                window.location.href = 'https://' + HOST + '/m/company.html?ccid=' + ccid + '';
            }
        }
    }

    function initWeixin(name, count, q, rank, url, logo) {
        window.WEIXINSHARE = {
            shareTitle: name + '排名第' + rank + '|2017Q' + q + '风口机构排行榜',
            shareUrl: url,
            shareImg: '' + logo + '',
            shareDesc: name + '' + count + '个投资项目都在这里',
        };

        var obj = {};
        window.InitWeixin(obj);
    }

    function initTitle(t) {
        document.title = t;
    }

    function joinpro() {
        var item = orgInfo.data;
        item.rank = parseInt(vm.rank);
        item.currQuarter = vm.currQuarter;

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
            source:'organization',
            target:'join_org',
            org_id:orgInfo.data.orgId,
            client:client,
        });

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
        vm.shareWechat = shareWechat;
        vm.orgInfo = obj;

        init();

        function init() {
            sa.track('ViewPage', {
                    source: 'org_share',
                    org_id: vm.orgInfo.orgId,
                    page: 'org_share',
                });
        }

        function cancelModal() {
            $modalInstance.dismiss();
        }

        function shareWechat(p) {
            var isAndroid = !!navigator.userAgent.match(/android/ig);
            var isIos = !!navigator.userAgent.match(/iphone|ipod|ipad/ig);
            var client = 'H5';
            if (isAndroid) {
                client = 'Android';
            }else if (isIos) {
                client = 'iOS';
            }

            forwardCount();
            if (hybrid.isInApp) {
                if (p === 'f') {
                    sa.track('OrgTopListClick',
                      {
                        source:'organization',
                        target:'moments',
                        org_id:vm.orgInfo.orgId,
                        client:client,
                    });
                    hybrid.open('weChatShareMoments');
                }else {
                    sa.track('OrgTopListClick',
                      {
                        source:'organization',
                        target:'wechat',
                        org_id:vm.orgInfo.orgId,
                        client:client,
                    });
                    hybrid.open('weChatShareFriend');
                }

                $timeout(function () {
                    window.location.href = 'http://cn.mikecrm.com/RRL7k2h';
                }, 2000);
            }
        }

        function forwardCount() {
            BangDanService.forwardCount(vm.orgInfo.orgId)
            .then(function setdata(response) {
            })
            .catch(fail);
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
