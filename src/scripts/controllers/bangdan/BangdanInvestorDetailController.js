var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('BangdanInvestorDetailController', BangdanInvestorDetailController);

function BangdanInvestorDetailController(loading, $scope, $modal, $stateParams, FindService,
    $state, UserService, BangDanService, ErrorService, hybrid, $rootScope, $timeout) {
    var vm = this;
    vm.page = 0;
    vm.busy = false;
    vm.prolist = [];
    vm.rank = '1';
    vm.openMore = openMore;
    vm.intro = '而我却二而我却二而我却二我却二我却二我却二我却二我却二我却二我却二我却二我却二我却二我却二我却二我却二我却二我却二我却二我却二我却二我却二我却二我却二我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二而我却二';
    vm.industry = '文娱·文娱·文娱·文娱·文娱·文娱·文娱·文娱·文娱·文娱·文娱·文娱·文娱·文娱·文娱·文娱·文娱·文娱·文娱·文娱·文娱·文娱·文娱·文娱·文娱·文娱·文娱·文娱·文娱·文娱';
    vm.collapse = true;
    init();

    function init() {
        getProList();
    }

    function getProList() {
        if (vm.busy) return;
        vm.busy = true;

        var params = {
            page: vm.page + 1,
            pageSize: 20,
        };

        BangDanService.getOrgProRank($stateParams.id, params)
        .then(function setdata(response) {
            vm.startloading = false;
            loading.hide('bangdanDetailLoading');
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

    function openMore(e) {
        var obj = angular.element(e.currentTarget);
        var openClose = obj.find('.open-close');

        var $infoObj = obj.parent().find('.info-content').find('.info').find('.text-content');
        var $indObj = obj.parent().find('.info-content').find('.industry').find('.in-right').find('.text-content');
        var lineClamp  = '-webkit-line-clamp';
        var fhclmp = $infoObj.attr('cla-height');
        var ihclmp = $indObj.attr('cla-height');
        var fh = $infoObj.attr('o-height');
        var ih = $indObj.attr('o-height');

        if (vm.collapse) {
            $infoObj.css(lineClamp, '');
            $infoObj.css('transition', 'height 0.3s');
            $infoObj.css('height', fh + 'px');

            $indObj.css(lineClamp, '');
            $indObj.css('transition', 'height 0.3s');
            $indObj.css('height', ih + 'px');
            openClose.css('transform', 'rotate(180deg)');
            vm.collapse = false;
        }else {
            $infoObj.css('transition', 'height 0.3s');
            $infoObj.css('height',  fhclmp + 'px');
            $infoObj.css(lineClamp, '4');
            $indObj.css(lineClamp, '2');

            $indObj.css('transition', 'height 0.3s');
            $indObj.css('height',  ihclmp + 'px');
            openClose.css('transform', '');
            vm.collapse = true;
        }

    }

    function fail(err) {
        loading.hide('bangdanDetailLoading');
        if (err.code === '403') {
            console.log(err.msg);
        } else if (err.code === '1') {
            ErrorService.alert(err.msg);
        }
    }

}
