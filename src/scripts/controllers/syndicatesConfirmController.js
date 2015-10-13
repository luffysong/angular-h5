/**
 * Controller Name: ApplyProvisionController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesConfirmController',
    function($scope, UserService, $modal, ErrorService, $stateParams,DictionaryService,CrowdFundingService,notify,CompanyService,$timeout,$state,$rootScope) {
        if(navigator.userAgent.match(/mac/i)){
            $scope.system = "ios";
        }else{
            $scope.system = "android";
        }
        $scope.companyId = $stateParams.cid;
        $scope.fundingId = $stateParams.fundingId;
        $scope.uid = UserService.getUID();
        $scope.formData = {};
        $scope.isRead = false;
        $scope.isPreHeat = false;
        $scope.validateSuc = false;
        $scope.activeBtn = "";
        $scope.krCode = {
            number:""
        };
        $scope.payType = "card";
        /*选择支付方式*/
        $scope.selectWay = function(target){
            $scope.payType = target;
        }
        var statusList = DictionaryService.getDict("crowd_funding_status");
        CompanyService.get({
            id:$scope.companyId
        },function(data){
            console.log(data);
            $scope.companyData = data.basic;
        },function(err){
            ErrorService.alert(err);
        });
        CrowdFundingService["crowd-funding"].get({
            "id":$scope.fundingId
        },function(data){
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
            if(!$scope.baseData.detail.agreements_img){
                $scope.baseData.detail.agreements_img = [];
            }
            $scope.baseData.detail.agreements_img.push(obj);
        });
        /*金额四舍五入取小数点后四位*/
        $scope.handleData = function (data) {
            return data.toFixed(4) + "%";
        };
        /*实时计算数据*/
        $scope.$watch("formData.investVal", function (from) {
            if(!/^[0-9]{0,}$/.test(from)){
                $scope.formData.ensureVal = 0;
            }else{
                $scope.formData.ensureVal = from;
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
                    if(!/^[0-9]{0,}$/.test(from)){
                        var max = "0%",min = "0%";
                    }else{
                        var min = $scope.handleData(from * 100 / (valuation + num + parseInt($scope.baseData.base.cf_min_raising)));
                        var max = $scope.handleData(from * 100 / (valuation + num + parseInt($scope.baseData.base.cf_max_raising)));
                    }
                    $scope.sharePercent = max + "~" + min;
                } else {
                    /*旧股*/
                    if(!/^[0-9]{0,}$/.test(from)){
                        var per = 0;
                    }else{
                        var per = from * 100 / valuation;
                    }
                    $scope.sharePercent = $scope.handleData(per);
                }
            }
        });
        $scope.seeProtocol = function(event,link,type) {
            $scope.actionSheet = false;
            if (link == "#/riskTipAll") {
                event.preventDefault();
                $modal.open({
                    templateUrl: 'templates/company/pop-risk-tip-all.html',
                    windowClass: 'remind-modal-window',
                    controller: [
                        '$scope', '$modalInstance', 'scope',
                        function ($scope, $modalInstance, scope) {
                            $scope.ok = function () {
                                $modalInstance.dismiss();
                            }
                        }
                    ],
                    resolve: {
                        scope: function () {
                            return $scope;
                        }
                    }
                });
            } else {
                if(type == "img"){
                    event.preventDefault();
                    $modal.open({
                        templateUrl: 'templates/company/pop-all-protocol.html',
                        windowClass: 'remind-modal-window',
                        controller: [
                            '$scope', '$modalInstance', 'scope',
                            function ($scope, $modalInstance, scope) {
                                $scope.modalBg = link;
                                $scope.ok = function () {
                                    $modalInstance.dismiss();
                                }
                            }
                        ],
                        resolve: {
                            scope: function () {
                                return $scope;
                            }
                        }
                    });
                }
            }
        };
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
            function goToPay(num){
                num = num ? num : $scope.formData.investVal;
                /*支付宝*/
                if($scope.payType == 'alipay') {
                    CrowdFundingService['cf-trade'].save({}, {
                        user_id: $scope.uid,
                        goods_id: $scope.fundingId,
                        goods_name: '众筹跟投', //TODO:这两个字段得产品确认一下写啥
                        goods_desc: '众筹跟投',
                        investment: num,
                        invite_code: $scope.krCode.number
                    }, function(data) {
                        location.href = '//'+location.host+'/p/payment/4/send-payment-request?'+(['pay_type=D','trade_id='+data.trade_deposit_id,'url_order=http:'+encodeURIComponent($scope.rongHost+'/m/#/zhongchouAllOrder'),'back_url=http:'+encodeURIComponent($scope.rongHost+'/m/#/zhongchouAllOrder')]).join('&');
                    }, function(err) {
                        ErrorService.alert(err);
                    });
                } else {
                    CrowdFundingService['cf-trade'].save({},{
                        user_id: $scope.uid,
                        goods_id: $scope.fundingId,
                        goods_name: '众筹跟投', //TODO:这两个字段得产品确认一下写啥
                        goods_desc: '众筹跟投',
                        investment: num,
                        invite_code:$scope.krCode.number
                    }, function(data){
                        console.log(data);
                        if(!$scope.hasRecord){
                            location.href = '//'+location.host+'/p/payment/3/send-payment-request?'+(['pay_type=D','trade_id='+data.trade_deposit_id,'url_order=http:'+encodeURIComponent($scope.rongHost+'/m/#/zhongchouAllOrder'),'back_url=http:'+encodeURIComponent($scope.rongHost+'/m/#/zhongchouAllOrder')]).join('&');
                        }else{
                            $state.go('syndicatesPay', {
                                tid: data.trade_deposit_id,
                                amount:num*0.01,
                                type:"deposit"
                            });
                        }
                    },function(err){
                        ErrorService.alert(err);
                    });
                }
            }
            if($scope.formData.investVal < $scope.baseData.base.min_investment){
                ErrorService.alert({
                    msg:"投资金额不能小于最低跟投金额"
                });
                return;
            }else if($scope.formData.investVal > $scope.baseData.base.cf_max_raising - $scope.baseData.funding.lead_investment){
                 $modal.open({
                     templateUrl: 'templates/company/pop-amount-notEnough.html',
                     controller: [
                     '$scope', '$modalInstance','scope',
                     function ($scope, $modalInstance, scope) {
                         $scope.account = $scope.remainAmount =  scope.baseData.base.cf_max_raising - scope.baseData.funding.lead_investment;
                         $scope.remainAmount = $scope.remainAmount >= 10000 ? $scope.remainAmount / 10000 + "万" : $scope.remainAmount;
                         $scope.ok = function(){
                             goToPay($scope.account);
                         }
                         $scope.cancel = function () {
                            $modalInstance.dismiss();
                         }
                     }],
                     resolve: {
                         scope: function(){
                         return $scope;
                         }
                     }
                 });
                return;
            }else{
                goToPay();
            }
        }
        /*加减按钮*/
        $scope.countVal = function(type){
            $scope.activeBtn = type;
            if(!/^[0-9]{0,}$/.test($scope.formData.investVal)){
                $scope.formData.investVal = $scope.baseData.base.min_investment;
                return;
            }
            if(type == "plus"){
                if($scope.formData.investVal < $scope.baseData.base.min_investment){
                    $scope.formData.investVal = $scope.baseData.base.min_investment;
                }else{
                    $scope.formData.investVal = parseInt($scope.formData.investVal)+10000;
                }
            }else {
                if($scope.formData.investVal >= ($scope.baseData.base.min_investment+10000)){
                    $scope.formData.investVal -= 10000;
                }else{
                    ErrorService.alert({
                        msg:"不能低于起投金额"
                    });
                    $scope.formData.investVal = $scope.baseData.base.min_investment;
                }
            }
        }
    });

