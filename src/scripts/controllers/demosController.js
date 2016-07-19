
var  angular = require('angular');
angular.module('defaultApp.controller')
.controller('DemosController', DemosController);

function DemosController(demosService, $stateParams, demos, loading) {
    var vm = this;
    vm.id = $stateParams.id;
    vm.vadliateAndGetDemos = vadliateAndGetDemos;

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
        if (angular.isArray(demos)) {
            vm.demos = demos;
            vm.fetchCode = undefined;
            vm.invalid = false;
        }else {
            vm.demos = null;
            vm.fetchCode = demos.fetchCode;
        }

        return demos;
    }

    function invalidate() {
        vm.invalid = true;
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
