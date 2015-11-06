/**
 * Controller Name: syndicatesPayOutlineController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('payOutlineRemindController',
    function($scope, UserService, ErrorService, $stateParams, CrowdFundingService) {
        $scope.tid = $stateParams.tid;
        $scope.type = $stateParams.type;
    });
