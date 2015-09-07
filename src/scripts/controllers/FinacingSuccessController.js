/**
 * Controller Name: FinacingSuccessController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('FinacingSuccessController',
    function($scope, $rootScope, $stateParams, $location, loading, $modal, CompanyService, UserService, DictionaryService, $http, ErrorService, $timeout) {
        $scope.uid = UserService.getUID();
        $scope.stateParams = $stateParams;
        // 返回上一页
        $scope.goBack = function(e) {
            e && e.preventDefault();
            history.go(-1);
        }
        
        if(!$stateParams.cid) return;
        $scope.finacingList = {};
        
        loading.show('finacingSuccess');
        CompanyService.ventureApply($scope.stateParams.cid, {
            type: $stateParams.from
        }, function(data) {
            $scope.finacingList = data;
            loading.hide('finacingSuccess');
        });
    }
);