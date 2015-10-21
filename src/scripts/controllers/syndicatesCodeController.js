/**
 * Controller Name: ApplyProvisionController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesCodeController',
    function($scope, $modal, ErrorService, $stateParams,CrowdFundingService,notify,checkForm) {
        $scope.fundingId = $stateParams.fundingId;
        $scope.companyId = $stateParams.cid;
        $scope.applySuc = false;
        CrowdFundingService["crowd-funding"].get({
            "id":$scope.fundingId
        },function(data){
            $scope.baseData = data;
            $scope.wishNum = $scope.baseData.base.min_investment;
        });
        $scope.$watch("wishNum",function(from){
            if(!$scope.baseData)return;
            if(from < $scope.baseData.base.min_investment){
                $scope.minError = true;
            }else{
                $scope.minError = false;
            }
        });
        /*申请Kr码*/
        $scope.apply = function(){
            if(!checkForm("applyCodeForm"))return;
            CrowdFundingService.save({
                model:"crowd-funding",
                id:$scope.fundingId,
                submodel:"invite-code-apply"
            },{
                investment:$scope.wishNum,
                reason:$scope.reason
            },function(data){
                $scope.applySuc = true;
            },function(err){
                ErrorService.alert(err);
            });
        }
    });
