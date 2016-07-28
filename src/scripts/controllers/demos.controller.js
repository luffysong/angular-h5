
var  angular = require('angular');
angular.module('defaultApp.controller')
.controller('DemosController', DemosController);

function DemosController(demosService, $stateParams, demos, loading) {
    var vm = this;
    vm.id = $stateParams.id;
    vm.busy = true;
    vm.demos = [];

    vm.vadliateAndGetDemos = vadliateAndGetDemos;
    vm.loadMore = loadMore;
    init();
    function init() {
        loadBaseInfo($stateParams.id);
        renderDemos(demos);
        loading.hide('demos');
    }

    function vadliateAndGetDemos() {
        demosService.getDemos($stateParams.id, vm.password)
            .then(renderDemos)
            .catch(invalidate);
    }

    function renderDemos(demos) {
        var NOT_AUTHORIZE = 401;
        if (demos.code !== NOT_AUTHORIZE) {
            vm.demos = vm.demos || [];
            vm.demos = vm.demos.concat(demos.data);
            vm.page = demos.page;
            vm.fetchCode = undefined;
            vm.invalid = false;
        }else {
            vm.demos = null;
            vm.fetchCode = demos.fetchCode;
        }

        if (demos.totalPages !== demos.page) {
            vm.busy = false;
        } else {
            vm.finish = true;
        }

        return demos;
    }

    function invalidate() {
        vm.invalid = true;
    }

    function loadMore() {
        if (vm.busy)return;
        vm.busy = true;
        demosService.getDemos($stateParams.id, ++vm.page)
        .then(renderDemos);
    }

    function loadBaseInfo(id) {
        demosService.getBaseInfo(id)
            .then(function setBaseInfo(data) {
                vm.count = data.proSetCount;
                vm.banner = data.proSetImgUrl;
                vm.name = data.proSetName;
                document.title = data.proSetName;
            });
    }
}
