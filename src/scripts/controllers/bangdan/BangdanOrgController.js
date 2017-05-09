var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('BangdanOrgController', BangdanOrgController);

function BangdanOrgController(loading, $scope, $modal, $stateParams, FindService,
    $state, UserService, ErrorService, hybrid, $rootScope, $timeout) {

    init();

    function init(){
        $('.J_commonHeaderWrapper').remove();
    }
}