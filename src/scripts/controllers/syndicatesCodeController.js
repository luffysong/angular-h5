/**
 * Controller Name: ApplyProvisionController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesCodeController',
    function($scope, $modal, ErrorService, $stateParams,CrowdFundingService,notify,checkForm,loading) {
        loading.show("codePage");
        $scope.fundingId = $stateParams.fundingId;
        $scope.companyId = $stateParams.cid;
        $scope.applySuc = false;
        $scope.krCode = {
            status:"unapply"
        };
        CrowdFundingService["crowd-funding"].get({
            "id":$scope.fundingId
        },function(data){
            $scope.baseData = data;
            $scope.wishNum = $scope.baseData.base.min_investment;
        });
        /*获取Kr码审核信息*/
        CrowdFundingService["audit"].get({
            id:"invite-code-cf-apply-result",
            cf_id:$scope.fundingId
        },function(data){
            console.log(data);
            $scope.krCode.status = data.status;
            $scope.krCode.reason = data.reason_fail;
            $scope.krCode.code = data.code;
            loading.hide("codePage");
        },function(err){
            if(err.code == 404 || err.code == 500){
                $scope.krCode.status = "unapply";
                loading.hide("codePage");
            }else{
                ErrorService.alert(err);
            }
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
