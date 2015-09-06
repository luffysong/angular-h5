/**
 * Controller Name: CreateApplyController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('CreateApplyController',
    function($scope, $rootScope, $state, $stateParams, $location, $modal, CompanyService, UserService, DictionaryService, $http, ErrorService, $timeout) {
        $scope.stateParams = $stateParams;
        $scope.goOnApply = function(e) {
        	e && e.preventDefault();
        	if($stateParams.from) {
        		CompanyService.ventureApply($stateParams.cid, {
	                type: $stateParams.from
	            }, function(data) {
	                if(data.company) {
                        $state.go('finacingSuccess', {from: $stateParams.from, cid: $scope.myCompanyList.selectedCompanyId});
                    } else {
                        $state.go('finacingSuccess', {from: $stateParams.from});
                    }
	            })
        	}
        }
    }
);