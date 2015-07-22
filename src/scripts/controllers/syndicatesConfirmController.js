/**
 * Controller Name: ApplyProvisionController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesConfirmController',
    function($scope, UserService, $modal, ErrorService, $stateParams,DictionaryService,CrowdFundingService,notify,CompanyService,$timeout,$state,$rootScope) {
        $scope.companyId = $stateParams.cid;
        $scope.fundingId = $stateParams.fundingId;
        $scope.uid = UserService.getUID();
        $scope.formData = {};
        $scope.isRead = false;
        $scope.isPreHeat = true;
        $scope.validateSuc = false;
        $scope.krCode = {
            number:""
        };
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
                    }else{
                        $scope.isPreHeat = false;
                    }
                }
            });
            /*输入框默认为最低投资金额*/
            $scope.formData.investVal = $scope.baseData.base.min_investment;
            var obj = {
                link:"#/riskTipAll",
                name:"风险揭示书"
            };
            if(!$scope.baseData.detail.agreements){
                $scope.baseData.detail.agreements = [];
            }
            $scope.baseData.detail.agreements.push(obj);
            console.log($scope.baseData.detail.agreements);
        });
        $scope.$watch("krCode.number",function(from){
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
        $scope.seeProtocol = function(event,link){
            if(link == "#/riskTipAll"){
                event.preventDefault();
                $modal.open({
                    templateUrl: 'templates/company/pop-risk-tip-all.html',
                    windowClass: 'remind-modal-window',
                    controller: [
                        '$scope', '$modalInstance','scope',
                        function ($scope, $modalInstance, scope) {
                            $scope.ok = function(){
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

        }
        /*查看风险点*/
        $scope.seeRisk = function(){
            $modal.open({
                templateUrl: 'templates/company/pop-risk-tip.html',
                windowClass: 'remind-modal-window',
                controller: [
                    '$scope', '$modalInstance','scope',
                    function ($scope, $modalInstance, scope) {
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
        /*用户签约信息查询*/
        CrowdFundingService["payment"].get({
            id:3,
            submodel:"user-bankcard",
            subid:$scope.uid,
            pay_type:"D"
        },function(data){
            if(data.agreement_list.length){
                $scope.hasRecord = true;
            }else{
                $scope.hasRecord = false;
            }
        },function(err){
            $scope.hasRecord = false;
        });
        /*校验Kr码*/
        $scope.checkCode = function(){
            /*输入达到8位时，调用check*/
            if($scope.krCode.number.length == 8){
                CrowdFundingService.get({
                    model:"crowd-funding",
                    id:$scope.fundingId,
                    submodel:"invite-code-check",
                    subid:$scope.krCode.number
                },function(data){
                    $scope.validateSuc = true;
                },function(err){
                    $scope.errMsg = err.msg;
                    $scope.validateSuc = false;
                    $scope.hasCheck = true;
                });

            }else{
                return;
            }
        }
        /*打开ActionSheet*/
        $scope.seeAgreement = function(){
            $scope.actionSheet = true;
        }
        $scope.cancel = function(event){
            $scope.actionSheet = false;
        }
        $scope.ensurePay = function(){
            if($scope.formData.investVal < $scope.baseData.base.min_investment){
                ErrorService.alert({
                    msg:"投资金额不能小于最低跟投金额"
                });
                return;
            }
            $scope.remainAmount = $scope.baseData.base.cf_max_raising - $scope.baseData.base.cf_success_raising;
            $scope.remainAmount = Math.max($scope.remainAmount,0);
            function goToPay(){
                    CrowdFundingService['cf-trade'].save({},{
                        user_id: $scope.uid,
                        goods_id: $scope.fundingId,
                        goods_name: '众筹跟投', //TODO:这两个字段得产品确认一下写啥
                        goods_desc: '众筹跟投',
                        investment: Math.min($scope.formData.investVal,$scope.remainAmount),
                        invite_code:$scope.krCode.number
                    }, function(data){
                        if(!$scope.hasRecord){
                            location.href = '//'+location.host+'/p/payment/3/send-payment-request?'+(['pay_type=D','trade_id='+data.trade_id,'url_order='+encodeURIComponent(location.href),'back_url=http:'+$scope.rongHost+'/#/zhongchouOrder/'+$rootScope.companyId+"/"+$rootScope.fundingId]).join('&');
                        }else{
                            $state.go('syndicatesPay', {
                                tid: data.trade_id,
                                amount:Math.min($scope.formData.investVal,$scope.remainAmount)
                            });
                        }
                    },function(err){
                        ErrorService.alert(err);
                    });
                }

                /*剩余金额不足，小于用户投资金额*/
                if($scope.formData.investVal > $scope.remainAmount){
                    $modal.open({
                        templateUrl: 'templates/company/pop-amount-notEnough.html',
                        controller: [
                            '$scope', '$modalInstance','scope',
                            function ($scope, $modalInstance, scope) {
                                $scope.remainAmount =  scope.remainAmount;
                                $scope.notEnougn = $scope.remainAmount < scope.baseData.base.min_investment ? true : false;
                                $scope.remainAmount = $scope.remainAmount >= 10000 ? $scope.remainAmount / 10000 + "万" : $scope.remainAmount;
                                $scope.ok = function(){
                                    goToPay();
                                }
                                /*$scope为弹出层中scope*/
                                $scope.cancel = function () {
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
                }else{
                    goToPay();
                }
            }
    });

