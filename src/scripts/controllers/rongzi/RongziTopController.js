var angular = require('angular');
angular.module('defaultApp.controller')
  .controller('RongziTopController', RongziTopController);

function RongziTopController($timeout, $scope, $modal, loading, $stateParams, RongziService, FindService, $state, UserService, ErrorService) {
    var _this = this;
    _this.needApp = true;
    _this.investRole = false;
    _this.hasEmail = false;
    _this.url = '111111';
    _this.subscribe = subscribe;
    
    init();
    function init() {
    };

    function removeHeader() {
        $('.common-header.J_commonHeaderWrapper').remove();
    }

    function subscribe() {
        console.log('======');
    }

}
