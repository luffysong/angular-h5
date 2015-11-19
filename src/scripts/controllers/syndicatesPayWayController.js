/**
 * Controller Name: ApplyProvisionController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesPayWayController',
    function($scope, UserService , $stateParams,DictionaryService,CrowdFundingService,CoInvestorService,$state,$rootScope,ErrorService,loading) {
        loading.show("payWay");
        var text = {
            deposit:"支付保证金",
            balance:"支付剩余款"
        };
        $scope.type = $stateParams.type;
        $scope.interFace = {
            deposit:"cf-trade-deposit",
            balance:"cf-trade-balance"
        };
        $scope.typeText = text[$scope.type];
        $scope.uid = UserService.getUID();
        $scope.tid = $stateParams.tid;
        $scope.ids = $stateParams.ids || "";
        $scope.calAmount = $stateParams.calAmount;
        $scope.payType = "alipay";
        $scope.bankDetails = DictionaryService.getDict('bank_limit_lianlianpay');
        /*$scope.amount = $stateParams.amount;*/
       /* if($scope.ids && $scope.type == "balance" && $scope.calAmount > 0){
            $scope.amount = $stateParams.amount - $scope.calAmount;
        }else{
            $scope.amount = $stateParams.amount;
        }*/
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

        /*根据订单类型调相应接口*/
        CrowdFundingService[$scope.interFace[$scope.type]].get({
            id:$stateParams.tid
        },function(data){
            $scope.amount = data.payment.amount;
            if($scope.orderType != "deposit"){
                if(data.payment.amount_coupons > 0){
                    $scope.hasUseCoupon = true;
                    $scope.amount = data.payment.amount * 1;
                    $scope.calAmount = data.payment.amount_coupons;
                    $scope.couponData = data.trade_coupon;
                    loading.hide("payWay");
                }else{
                    $scope.hasUseCoupon = false;
                    if($scope.calAmount > 0){
                        $scope.amount = data.payment.amount * 1 - $scope.calAmount;
                    }
                    $scope.loadCoupon();
                }
            }
        },function(err){
            ErrorService.alert(err);
        });
        /*加载优惠劵*/
        $scope.loadCoupon = function(){
            CrowdFundingService["coupon"].get({
                per_page:8,
                page:1,
                uid:$scope.uid,
                expire:2,
                status:1
            },function(data){
                $scope.couponData = data.data;
                loading.hide("payWay");
            });
        }
        $scope.goPay = function(){
            if($scope.type != "deposit" && !$scope.hasUseCoupon && $scope.calAmount > 0){
                $scope.showEnsure = true;
            }else{
                $scope.showEnsure = false;
                $scope.skipPay();
            }
        }
        $scope.skipPay = function(){
            /*支付宝*/
            if($scope.payType == 'alipay'){
                location.href = '//'+location.host+'/p/payment/4/send-payment-request?'+(['pay_type=D','trade_id='+$scope.tid,'url_order=http:'+encodeURIComponent($scope.rongHost+'/m/#/zhongchouAllOrder'),'back_url=http:'+encodeURIComponent($scope.rongHost+'/m/#/zhongchouAllOrder'),'coupon_ids='+$scope.ids]).join('&');
            }else {
                if(!$scope.hasRecord){
                    location.href = '//'+location.host+'/p/payment/3/send-payment-request?'+(['pay_type=D','trade_id='+$scope.tid,'url_order=http:'+$scope.rongHost+encodeURIComponent($scope.rongHost+'/m/#/zhongchouAllOrder'),'back_url=http:'+encodeURIComponent($scope.rongHost+'/m/#/zhongchouAllOrder'),'coupon_ids='+$scope.ids]).join('&');
                }else{
                    $state.go("syndicatesPay",{
                        tid:$scope.tid,
                        amount:$scope.amount,
                        type:$scope.type,
                        ids:$scope.ids
                    });
                }
            }
        }
    });

