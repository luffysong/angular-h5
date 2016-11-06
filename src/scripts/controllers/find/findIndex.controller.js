
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('FindIndexController', FindIndexController);

function FindIndexController(FindService, ErrorService, hybrid, loading, $interval, $scope) {
    var vm = this;

    //轮播图返回的数据
    vm.slides = [];
    vm.responseData = {};

    init();
    function init() {
        FindService.getRoundpics()
            .then(function temp(response) {
                vm.slides = angular.copy(response.data.data);
            })
            .catch(error);

        FindService.filter()
            .then(function temp(response) {
                vm.responseData = angular.copy(response.data.group[0].beans);
                vm.responseData = vm.responseData.concat(response.data.group[1].beans);
            })
            .catch(error);
    }

    function error(err) {
        ErrorService.alert(err);
    }

}
