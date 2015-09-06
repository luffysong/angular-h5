/**
 * Controller Name: FinacingSuccessController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('FinacingSuccessController',
    function($scope, $rootScope, $stateParams, $location, $modal, CompanyService, UserService, DictionaryService, $http, ErrorService, $timeout) {
        $scope.uid = UserService.getUID();
        $scope.stateParams = $stateParams;

        if(!$stateParams.cid) return;
        $scope.finacingList = {};
        CompanyService.ventureApply($scope.stateParams.cid, {
            from: $stateParams.from
        }, function(data) {
            $scope.finacingList = data;
        })
    }
);