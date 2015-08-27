var angular = require('angular');

angular.module('defaultApp.controller').controller('SyndicatesProcedureController', [
    '$scope', '$state', 'notify', '$stateParams',
    function($scope,  $state, notify, $stateParams) {
        //处理参数
        $scope.params = {};
        $scope.params.fid = $stateParams.fid || 0;

        if(!$scope.params.fid) {
            return $state.go('syndicatesAllOrder');
        }
    }
]);
