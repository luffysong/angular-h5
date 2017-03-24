var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('HotFocusController', HotFocusController);

function HotFocusController(loading, ErrorService, FindService, $stateParams, $state) {
    var vm = this;
    document.title = '关注热点';

    // URL 信息
    vm.params = {
        eventEnum: $stateParams.eventEnum || 'SEARCH',
        intervalEnum: $stateParams.intervalEnum || 'DAY',
    };

    // 列表信息
    vm.focusList = [];

    // 筛选
    vm.goToSee = goToSee;

    // 查看详情
    vm.goToDetail = goToDetail;

    // 页面初始化
    loading.show('hotFocus');
    init();

    function init() {
        FindService.getHotFocus({
            eventEnum: vm.params.eventEnum,
            intervalEnum: vm.params.intervalEnum,
        }).then(function(response) {
            loading.hide('hotFocus');
            if (response.data) {
                vm.focusList = angular.copy(response.data);
            }
        }).catch(error);
    }

    function error(err) {
        ErrorService.alert(err);
        loading.hide('hotFocus');
    }

    // 条件筛选
    function goToSee(params) {
        if (params.eventEnum) {
            vm.params.eventEnum = params.eventEnum;
        }
        if (params.intervalEnum) {
            vm.params.intervalEnum = params.intervalEnum;
        }
        $state.go('find.hotFocus', vm.params);
    }

    // 查看详情
    function goToDetail(cid) {
        console.log(cid);
        vm.params.id = cid;
        $state.go('find.hotFocusDetail', vm.params);
    }
}
