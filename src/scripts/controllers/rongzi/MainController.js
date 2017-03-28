
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('MainController', MainController);

function MainController(loading, $stateParams, ActivityService, $state, UserService, ErrorService) {
    var vm = this;

    init();

    function init() {
        loading.hide('findLoading');
        removeHeader();
        $('html').css('overflow', 'auto');
        $('body').css('overflow', 'auto');
        console.log(UserService.getUID());
    }
}

function removeHeader() {
    $('.common-header.J_commonHeaderWrapper').remove();
}
