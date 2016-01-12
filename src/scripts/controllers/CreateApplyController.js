/**
 * Controller Name: CreateApplyController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('CreateApplyController',
    function($scope, $rootScope, $state, $stateParams) {
        $scope.stateParams = $stateParams;
        $scope.goOnApply = function(e) {
            e && e.preventDefault();

            if ($stateParams.from) {
                $state.go('finacingSuccess', { from: $stateParams.from, cid: $stateParams.cid });
            }
        };
    }
);
