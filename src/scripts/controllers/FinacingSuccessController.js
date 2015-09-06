/**
 * Controller Name: FinacingSuccessController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('FinacingSuccessController',
    function($scope, $rootScope, $stateParams, $location, loading, $modal, CompanyService, UserService, DictionaryService, $http, ErrorService, $timeout) {
        $scope.uid = UserService.getUID();
        $scope.stateParams = $stateParams;

        if(!$stateParams.cid) return;
        $scope.finacingList = {};
        loading.show('finacingSuccess');
        CompanyService.ventureApply($scope.stateParams.cid, {
            type: $stateParams.from
        }, function(data) {
            $scope.finacingList = data;
            loading.hide('finacingSuccess');
        })
    }
);