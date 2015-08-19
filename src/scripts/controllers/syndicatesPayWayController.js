/**
 * Controller Name: ApplyProvisionController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesPayWayController',
    function($scope, UserService , $stateParams,DictionaryService,CrowdFundingService,CoInvestorService,$state,$rootScope) {
        $scope.uid = UserService.getUID();
        $scope.tid = $stateParams.tid;
        $scope.amount = $stateParams.amount;
        $scope.payType = "card";
        $scope.bankDetails = DictionaryService.getDict('bank_limit_lianlianpay');
        /*选择支付方式*/
        $scope.selectWay = function(target){
            $scope.payType = target;
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
        $scope.goPay = function(){
            /*支付宝*/
            if($scope.payType == 'alipay'){
                location.href = '//'+location.host+'/p/payment/4/send-payment-request?'+(['pay_type=D','trade_id='+$scope.tid,'url_order=http:'+encodeURIComponent($scope.rongHost+'/m/#/zhongchouAllOrder'),'back_url=http:'+encodeURIComponent($scope.rongHost+'/m/#/zhongchouAllOrder')]).join('&');
            }else {
                if(!$scope.hasRecord){
                    location.href = '//'+location.host+'/p/payment/3/send-payment-request?'+(['pay_type=D','trade_id='+$scope.tid,'url_order=http:'+$scope.rongHost+encodeURIComponent($scope.rongHost+'/m/#/zhongchouAllOrder'),'back_url=http:'+encodeURIComponent($scope.rongHost+'/m/#/zhongchouAllOrder')]).join('&');
                }else{
                    $state.go("syndicatesPay",{
                        tid:$scope.tid,
                        amount:$scope.amount
                    });
                }
            }
        }
    });
