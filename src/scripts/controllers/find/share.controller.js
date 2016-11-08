
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('ShareController', ShareController);

function ShareController(loading, $stateParams, FindService, ErrorService) {
    var vm = this;
    vm.type = $stateParams.type;
    vm.id = $stateParams.id;

    init();
    function init() {

        loading.hide('demos');

        var sendData = {
            proSetId: vm.id
        }

        FindService.getProjectColumn(sendData)
            .then(function temp(response) {
                vm.responseColumn = angular.copy(response.data);
                document.title = response.data.proSetName;
                vm.type = response.data.type;
            })
            .catch(error);

        var sendDataList = {
            proSetId: vm.id,
            pageSize: 3
        }

        FindService.getProjectList(sendDataList)
            .then(function temp(response) {
                vm.responseDetail = angular.copy(response.data.data.cells);
                vm.totalCount = angular.copy(response.data.data.totalCount);
            })
            .catch(error);
    }

    function error(err) {
        ErrorService.alert(err);
    }

}
