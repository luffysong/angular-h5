var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('HotFocusController', HotFocusController);

function HotFocusController(loading) {
    var vm = this;
    loading.hide('findLoading');
    vm.hotFocusList = [
        {
            origin: '36氪',
            title: '36氪搜索量增长30%',
            id: '1',
        },
        {
            origin: '京东',
            title: '京东搜索量减少10%',
            id: '2',
        },
        {
            origin: '京东',
            title: '京东搜索量减少30%',
            id: '3',
        },
    ];
}
