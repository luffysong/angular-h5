/**
 * Controller Name: ApplyProvisionController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesConfirmController',
    function($scope, UserService, $modal, ErrorService, $stateParams,DictionaryService,CrowdFundingService,notify,CompanyService,$timeout) {
        $scope.companyId = $stateParams.cid;
        $scope.fundingId = $stateParams.fundingId;
        $scope.formData = {};
        $scope.isRead = false;
        $scope.krCode = "";
        var statusList = DictionaryService.getDict("crowd_funding_status");
        CompanyService.get({
            id:$scope.companyId
        },function(data){
            $scope.companyData = data.basic;
        },function(err){
            ErrorService.alert(err);
        });
        CrowdFundingService["crowd-funding"].get({
            "id":$scope.fundingId
        },function(data){
            console.log(data);
            $scope.baseData = data;
            if(!$scope.baseData.base)return;
            if($scope.baseData.detail.lead_risk){
                $scope.baseData.detail.lead_risk_html = $scope.baseData.detail.lead_risk.replace(/\n/g,'<br/>');
            }
            angular.forEach(statusList,function(obj){
                if(obj.value == $scope.baseData.base.status){
                    $scope.baseData.base.status = obj.desc;
                    if(obj.value == 30 && new Date() < new Date($scope.baseData.base.start_time)){
                        $scope.isPreHeat = true;
                    }
                }
            });
            /*输入框默认为最低投资金额*/
            $scope.formData.investVal = $scope.baseData.base.min_investment;
        });
        $scope.$watch("krCode",function(from){
            if(from.length == 8){
                $scope.validateValid = true;
            }else{
                $scope.validateValid = false;
            }
        })
        /*金额四舍五入取小数点后四位*/
        $scope.handleData = function (data) {
            return data.toFixed(4) + "%";
        };
        /*实时计算数据*/
        $scope.$watch("formData.investVal", function (from) {
            if (!/^[0-9]{0,}$/.test(from)) {
                return;
            }
            if(!$scope.baseData.funding || !$scope.baseData.funding.valuation)return;
            /*管理费*/
            $scope.manager_fee = ($scope.baseData.funding.lead_management_fee * from).toFixed(2) ? ($scope.baseData.funding.lead_management_fee * from).toFixed(2) : 0;
            /*总支付费用*/
            $scope.total_fee = parseFloat($scope.manager_fee) + parseInt(from);
            if($scope.baseData.base){
                /*估值*/
                var valuation = parseInt($scope.baseData.funding.valuation);
                /*本轮融资金额与众筹金额之差*/
                var num = parseInt($scope.baseData.funding.fund_raising - $scope.baseData.funding.cf_raising);
                /*融资类型，新股*/
                if ($scope.baseData.base.financing_type == 1) {
                    var min = $scope.handleData(from * 100 / (valuation + num + parseInt($scope.baseData.base.cf_min_raising)));
                    var max = $scope.handleData(from * 100 / (valuation + num + parseInt($scope.baseData.base.cf_max_raising)));
                    $scope.sharePercent = max + "~" + min;
                } else {
                    /*旧股*/
                    var per = from * 100 / valuation;
                    $scope.sharePercent = $scope.handleData(per);
                }
            }
        });
        /*查看风险点*/
        $scope.seeRisk = function(){
            $modal.open({
                templateUrl: 'templates/company/pop-risk-tip.html',
                windowClass: 'remind-modal-window',
                controller: [
                    '$scope', '$modalInstance','scope','UserService','CrowdFundingService',
                    function ($scope, $modalInstance, scope,UserService,CrowdFundingService,$timeout) {
                        $scope.risk = scope.baseData.detail.lead_risk_html;
                        $scope.ok = function(){
                            $modalInstance.dismiss();
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

