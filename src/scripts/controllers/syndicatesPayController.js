/**
 * Controller Name: ApplyProvisionController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesPayController',
    function($scope, UserService , $stateParams,DictionaryService,CrowdFundingService,CoInvestorService,$state,$rootScope) {
        var text = {
            deposit:"支付保证金",
            balance:"支付剩余款"
        };
        $scope.orderType = $stateParams.type;
        $scope.typeText = text[$stateParams.type];
        $scope.uid = UserService.getUID();
        $scope.tid = $stateParams.tid;
        $scope.amount = $stateParams.amount;
        $scope.ids = $stateParams.ids;
        $scope.bankDetails = DictionaryService.getDict('bank_limit_lianlianpay');
        $scope.interFace = {
            deposit:"cf-trade-deposit",
            balance:"cf-trade-balance"
        };
        /*选择支付卡号Index*/
        $scope.cardIndex = "";
        /*用户签约信息查询*/
        CrowdFundingService["payment"].get({
            id:3,
            submodel:"user-bankcard",
            subid:$scope.uid,
            pay_type:"D"
        },function(data){
            if(!data.agreement_list.length){
                location.href = '//'+location.host+'/p/payment/3/send-payment-request?'+(['pay_type=D','trade_id='+$scope.tid,'url_order=http:'+$scope.rongHost+encodeURIComponent($scope.rongHost+'/m/#/zhongchouAllOrder'),'back_url=http:'+encodeURIComponent($scope.rongHost+'/m/#/zhongchouAllOrder'),'coupon_ids='+$scope.ids]).join('&');
                return;
            }
            $scope.bankData = data;
            angular.forEach($scope.bankData.agreement_list,function(obj,index){
                angular.extend(obj,$scope.bankDetails[obj.bank_code][$scope.bankDetails[obj.bank_code].length-1]);
            });
        },function(err){
            location.href = '//'+location.host+'/p/payment/3/send-payment-request?'+(['pay_type=D','trade_id='+$scope.tid,'url_order=http:'+encodeURIComponent($scope.rongHost+'/m/#/zhongchouAllOrder'),'back_url=http:'+encodeURIComponent($scope.rongHost+'/m/#/zhongchouAllOrder'),'coupon_ids='+$scope.ids]).join('&');
        });
        /*根据订单类型调相应接口*/
        CrowdFundingService[$scope.interFace[$scope.orderType]].get({
            id:$scope.tid
        },function(data){
            $scope.tradeData = data;
        },function(err){
        });
        /*选择卡号事件*/
        $scope.selectCard = function(index){
            $scope.cardIndex = index;
        }
        /*更新PlatfromType*/
        $scope.updatePlatType = function(){
            CrowdFundingService[$scope.interFace[$scope.orderType]].update({
                id:$scope.tid
            }, {
                platform_type:3
            }, function(){

            }, function(err){
            });
        }
        /*选择其他银行卡事件*/
        $scope.addCard = function(){
            $scope.updatePlatType();
            location.href = '//'+location.host+'/p/payment/3/send-payment-request?'+(['pay_type=D','trade_id='+$scope.tid,'url_order=http:'+encodeURIComponent($scope.rongHost+'/m/#/zhongchouAllOrder'),'back_url=http:'+encodeURIComponent($scope.rongHost+'/m/#/zhongchouAllOrder'),'coupon_ids='+$scope.ids]).join('&');
        }

        $scope.goPay = function(){
            if($scope.cardIndex === ""){
                $scope.noCard = true;
                return;
            }else{
                $scope.updatePlatType();
                location.href = '//'+location.host+'/p/payment/3/send-payment-request?'+(['no_agree='+$scope.bankData.agreement_list[$scope.cardIndex].no_agree,'pay_type=D','trade_id='+$scope.tid,'url_order=http:'+encodeURIComponent($scope.rongHost+'/m/#/zhongchouAllOrder'),'back_url=http:'+encodeURIComponent($scope.rongHost+'/m/#/zhongchouAllOrder'),'coupon_ids='+$scope.ids]).join('&');
            }
        }
    });

