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
        $scope.pay = {
            activeWay:"coupon"
        };
        $scope.chanel = {
            code:"",
            errorText:"请输入有效渠道码",
            id:""
        };
        /*输入渠道码*/
        $scope.enterCode = function(){
            if($scope.chanel.code && $scope.chanel.code.length == 10){
                CrowdFundingService["coupon-channel"].get({
                    code:$scope.chanel.code
                },function(data){
                    console.log(data.data);
                    if(!data.data.length){
                        $scope.chanel.error = true;
                    }else{
                        /*渠道码已过期*/
                        if(new Date() > new Date(data.data[0].expire_time)){
                            $scope.chanel.error = true;
                            $scope.chanel.errorText = "渠道码已过期";
                        }else{
                            $scope.chanel.validate = true;
                            $scope.chanel.error = false;
                            $scope.chanel.amount = data.data[0].amount;
                            $scope.chanel.id = data.data[0].id;
                        }
                    }
                },function(err){
                    $scope.chanel.error = true;
                    $scope.chanel.errorText = "请输入有效渠道码";
                    if(err.code != 404){
                        ErrorService.alert(err);
                    }
                });
            }
        }
        $scope.selectType = function(target){
            $scope.pay.activeWay = target;
            if(target == "code"){
                $scope.calAmount = 0;
                $scope.ids = "";
                $scope.amount = $scope.tradeData.payment.amount * 1;
            }else{
                $scope.chanel.id = "";
                $scope.chanel.amount = "";
            }
        }
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
        /*订单已绑定渠道码*/
        $scope.hasBind = false;
        /*根据订单类型调相应接口*/
        CrowdFundingService[$scope.interFace[$scope.type]].get({
            id:$stateParams.tid
        },function(data){
            $scope.tradeData = data;
            $scope.amount = data.payment.amount;
            if($scope.orderType != "deposit"){
                if(data.payment.amount_coupons > 0){
                    angular.forEach(data.trade_coupon,function(item){
                        if(item.channel){
                            $scope.hasBind = true;
                        }else{
                            $scope.hasBind = false;
                        }
                    });
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
        $scope.tip = {
            msgTitle:"确认使用投资券？",
            msgContent:"一旦使用则与该订单绑定，不可新增或删除投资券"
        };
        $scope.goPay = function(){
            if($scope.type != "deposit" && !$scope.hasUseCoupon){
                if($scope.pay.activeWay == "code" && $scope.chanel.validate){
                    $scope.showEnsure = true;
                    $scope.tip.msgTitle = "确认使用渠道码？";
                    $scope.tip.msgContent = "一旦使用则与该订单绑定，不可更改订单金额";
                }else if($scope.pay.activeWay == "coupon" && $scope.calAmount > 0){
                    $scope.showEnsure = true;
                    $scope.tip.msgTitle = "确认使用投资券？";
                    $scope.tip.msgContent = "一旦使用则与该订单绑定，不可新增或删除投资券";
                }else{
                    $scope.skipPay();
                }
            }else{
                $scope.showEnsure = false;
                $scope.skipPay();
            }
        }
        $scope.skipPay = function(){
            /*支付宝*/
            if($scope.payType == 'alipay'){
                location.href = '//'+location.host+'/p/payment/4/send-payment-request?'+(['pay_type=D','trade_id='+$scope.tid,'url_order=https:'+encodeURIComponent($scope.rongHost+'/m/#/zhongchouAllOrder'),'back_url=https:'+encodeURIComponent($scope.rongHost+'/m/#/zhongchouAllOrder'),'coupon_ids='+$scope.ids,'coupon_channel_id='+$scope.chanel.id]).join('&');
            }else {
                if(!$scope.hasRecord){
                    location.href = '//'+location.host+'/p/payment/3/send-payment-request?'+(['pay_type=D','trade_id='+$scope.tid,'url_order=https:'+$scope.rongHost+encodeURIComponent($scope.rongHost+'/m/#/zhongchouAllOrder'),'back_url=https:'+encodeURIComponent($scope.rongHost+'/m/#/zhongchouAllOrder'),'coupon_ids='+$scope.ids,'coupon_channel_id='+$scope.chanel.id]).join('&');
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

