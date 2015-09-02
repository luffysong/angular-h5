/**
 * Controller Name: CreateApplyController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('CreateApplyController',
    function($scope, $rootScope, $state, $stateParams, $location, $modal, CompanyService, UserService, DictionaryService, $http, ErrorService, $timeout) {
        $scope.stateParams = $stateParams;
        $scope.goOnApply = function(e) {
        	e && e.preventDefault();
        	if($stateParams.type) {
        		CompanyService.ventureApply($stateParams.cid, {
	                type: $stateParams.type
	            }, function(data) {
	                if(data.company) {
                        $state.go('finacingSuccess', {type: $stateParams.type, cid: $scope.myCompanyList.selectedCompanyId});
                    } else {
                        $state.go('finacingSuccess', {type: $stateParams.type});
                    }
	            })
        	}
        }
    }
);