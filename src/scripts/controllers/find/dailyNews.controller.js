
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('DailyNewsController', DailyNewsController);

function DailyNewsController(loading, FindService, ErrorService, hybrid) {
    var vm = this;

    vm.responseData = [];
    vm.ts = '';
    vm.busy = false;
    vm.loadMore = loadMore;
    vm.link = link;

    init();
    function init() {
        document.title = '每日报道';
        $('head').append('<meta name="format-detection" content="telephone=no" />');
        loading.hide('findLoading');
        loadData();
    }

    function loadData() {
        FindService.getDailyReport(vm.ts)
            .then(function temp(response) {
                vm.responseData = angular.copy(response.data.data);
                vm.ts = response.data.ts;
                vm.busy = false;
                vm.hasInit = true;
            })
            .catch(error);
    }

    function loadMore() {
        if (vm.busy)return;
        vm.busy = true;
        if (!vm.ts) {
            return;
        }

        FindService.getDailyReport(vm.ts)
            .then(function temp(response) {
                vm.responseData = vm.responseData.concat(response.data.data);
                vm.ts = response.data.ts;
                vm.busy = false;
            })
            .catch(error);
    }

    function error(err) {
        ErrorService.alert(err);
    }

    function link(ccid, link) {
        hybrid.open('addBottomViewInWeb/' + ccid);
        window.location.href = link;
    }

}
