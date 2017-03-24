var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('HotFocusController', HotFocusController);

function HotFocusController(loading, ErrorService, FindService, $stateParams) {
    var vm = this;
    document.title = '关注热点';

    // URL 信息
    vm.params = {
        eventEnum: $stateParams.eventEnum || 'SEARCH',
        intervalEnum: $stateParams.intervalEnum || 'DAY',
    };

    // 列表信息
    vm.focusList = [];

    // 页面初始化
    init();

    function init() {
        FindService.getHotFocus({
            eventEnum: vm.params.eventEnum,
            intervalEnum: vm.params.intervalEnum,
        }).then(function(response) {
            loading.hide('findLoading');
            if (response.data) {
                vm.focusList = angular.copy(response.data);
            }
        }).catch(error);
    }

    function error(err) {
        ErrorService.alert(err);
        loading.hide('findLoading');
    }

}
