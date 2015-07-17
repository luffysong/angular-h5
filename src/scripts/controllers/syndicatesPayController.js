/**
 * Controller Name: ApplyProvisionController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesPayController',
    function($scope, UserService , $stateParams,DictionaryService,CrowdFundingService,CoInvestorService,$state,$rootScope) {
        $scope.uid = UserService.getUID();
        $scope.tid = $stateParams.tid;
        $scope.amount = $stateParams.amount;
        $scope.bankDetails = DictionaryService.getDict('bank_limit_lianlianpay');
        /*选择支付卡号Index*/
        $scope.cardIndex = "";
        /*用户签约信息查询*/
        CrowdFundingService["payment"].get({
            id:3,
            submodel:"user-bankcard",
            subid:$scope.uid,
            pay_type:"D"
        },function(data){
            console.log(data);
            $scope.bankData = data;
            angular.forEach($scope.bankData.agreement_list,function(obj,index){
                angular.extend(obj,$scope.bankDetails[obj.bank_code][$scope.bankDetails[obj.bank_code].length-1]);
            });
        },function(err){
            console.log(err);
            $scope.hasRecord = false;
        });
        /*选择卡号事件*/
        $scope.selectCard = function(index){
            $scope.cardIndex = index;
        }
        /*更新PlatfromType*/
        $scope.updatePlatType = function(){
            CrowdFundingService['cf-trade'].update({
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
            location.href = '//'+location.host+'/p/payment/3/send-payment-request?'+(['pay_type=D','trade_id='+$scope.tid,'url_order='+encodeURIComponent(location.href),'back_url='+$scope.rongHost+'/#/zhongchouOrder/'+$rootScope.companyId+"/"+$rootScope.fundingId]).join('&');
        }

        $scope.goPay = function(){
            if($scope.cardIndex === ""){
                $scope.noCard = true;
                return;
            }else{
                $scope.updatePlatType();
                location.href = '//'+location.host+'/p/payment/3/send-payment-request?'+(['no_agree='+$scope.bankData.agreement_list[$scope.cardIndex].no_agree,'pay_type=D','trade_id='+$scope.tid,'url_order='+encodeURIComponent(location.href),'back_url='+$scope.rongHost+'/#/zhongchouOrder/'+$rootScope.companyId+"/"+$rootScope.fundingId]).join('&');
            }
        }
    });

