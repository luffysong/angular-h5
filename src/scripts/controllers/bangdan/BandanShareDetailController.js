var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('BandanShareDetailController', BandanShareDetailController);

function BandanShareDetailController(loading, $scope, $modal, $stateParams, FindService,
    $state, UserService, ErrorService, hybrid, $rootScope, $timeout) {

    init();

    function init(){
        $('.J_commonHeaderWrapper').remove();
    }
}