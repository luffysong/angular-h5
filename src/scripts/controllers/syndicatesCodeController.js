/**
 * Controller Name: ApplyProvisionController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesCodeController',
    function($scope, UserService, $modal, ErrorService, $stateParams,DictionaryService,CrowdFundingService,notify,CompanyService,$timeout,$state,$rootScope) {
        $scope.fundingId = $stateParams.fundingId;
        CrowdFundingService["crowd-funding"].get({
            "id":$scope.fundingId
        },function(data){
            $scope.baseData = data;
        });
        /*如何获得Kr码*/
        $scope.getKrCode = function(){
            $modal.open({
                templateUrl: 'templates/company/pop-apply-code.html',
                windowClass: 'remind-modal-window',
                controller: [
                    '$scope', '$modalInstance','scope','CrowdFundingService','checkForm',
                    function ($scope, $modalInstance, scope,CrowdFundingService,checkForm) {
                        $scope.$watch("wishNum",function(from){
                            if(from < scope.baseData.base.min_investment){
                                $scope.minError = true;
                            }else{
                                $scope.minError = false;
                            }
                        });
                        $scope.ok = function(){
                            if(!checkForm("krCodeForm")){
                                return;
                            }
                            CrowdFundingService.save({
                                model:"crowd-funding",
                                id:scope.fundingId,
                                submodel:"invite-code-apply"
                            },{
                                investment:$scope.wishNum
                            },function(data){
                                notify({
                                    message:"申请成功",
                                    classes:'alert-success'
                                });
                                $modalInstance.dismiss();
                            },function(err){
                                ErrorService.alert(err);
                            });
                        }
                        $scope.cancel = function() {
                            $modalInstance.dismiss();
                        }
                    }
                ],
                resolve: {
                    scope: function(){
                        return $scope;
                    }
                }
            });
        }
    });
