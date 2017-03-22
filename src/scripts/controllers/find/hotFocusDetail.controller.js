var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('HotFocusDetailController', HotFocusDetailController);

function HotFocusDetailController(loading) {
    var vm = this;
    loading.hide('findLoading');
}
