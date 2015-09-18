/**
 * Controller Name: FinacingSuccessController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('FinacingSuccessController',
    function($scope, $rootScope, $stateParams, $location, loading, $modal, CompanyService, UserService, DictionaryService, $http, ErrorService, $timeout) {
        $scope.uid = UserService.getUID();
        $scope.stateParams = $stateParams;
        $scope.successfulTips = false;
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
            console.log(data);
            if(data.company) {
                $scope.finacingList = data;
            } else {
                $scope.successfulTips = true;
            }
            loading.hide('finacingSuccess');
            
        });
    }
);