/**
 * Controller Name: ApplyProvisionController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesCouponController',
    function($scope,UserService,$stateParams,DictionaryService,CrowdFundingService,CoInvestorService,$state,$rootScope,ErrorService,$timeout,loading) {
        loading.show("couponList");
        $scope.isUse = false;
        $scope.useCoupon = function(){
            if(!$scope.isUse){
                angular.forEach($scope.inviteData,function(obj){
                    obj.active = false;
                });
            }
            $scope.isUse = !$scope.isUse;
        }
        $scope.uid = UserService.getUID();
        $scope.tid = $stateParams.tid;
        $scope.amount = $stateParams.amount;
        $scope.ids = $stateParams.ids || "";
        /*是否使用过优惠劵*/
        $scope.hasUseCoupon = false;
        /*已选优惠劵金额*/
        $scope.couponCount = 0;
        /*处理剩余时间封装函数*/
        $scope.handleTime = function(startTime,endTime){
            var obj = {};
            //计算时间差毫秒数
            var temp = new Date(endTime).getTime() - new Date(startTime).getTime();
            //计算出相差天数
            obj.days = Math.floor(temp/(24*3600*1000));
            //计算出小时数
            var leave1 = temp % (24*3600*1000);   //计算天数后剩余的毫秒数
            obj.hours = Math.floor(leave1/(3600*1000));
            //计算相差分钟数
            var leave2 = leave1 % (3600*1000);      //计算小时数后剩余的毫秒数
            obj.minutes = Math.floor(leave2/(60*1000));
            //计算相差秒数
            var leave3 = leave2 % (60*1000);      //计算分钟数后剩余的毫秒数
            obj.seconds = Math.round(leave3/1000);
            return obj;
        };
        $scope.countMax  = false;
        /*选择优惠劵*/
        $scope.selectCoupon = function(index){
            if($scope.hasUseCoupon || $scope.isUse){
                return;
            }
            var num = 0;
            $scope.couponCount = 0;
            angular.forEach($scope.inviteData,function(obj){
                if(obj.active){
                    num++;
                }
            });
            if(num < 2 || $scope.inviteData[index].active){
                $scope.inviteData[index].active = !$scope.inviteData[index].active;
            }else{
                $scope.countMax = true;
                $scope.calTop = $("body").scrollTop() - 40 + "px";
                $timeout(function(){
                    $scope.countMax = false;
                },2000);
            }
            angular.forEach($scope.inviteData,function(item){
                if(item.active)$scope.couponCount += parseInt(item.amount);
            });
        }
        /*处理优惠劵剩余时间*/
        $scope.leftTime = function(obj){
            angular.forEach(obj,function(item){
                var timeObj = $scope.handleTime(new Date(),item.expire_time.replace(/-/g,"/"));
                item.leftTime = timeObj.days + "天";
            });
        }
        /*加载优惠劵*/
        $scope.loadCoupon = function(obj){
            CrowdFundingService["coupon"].get({
                per_page:obj.perPage,
                page:obj.page,
                uid:$scope.uid,
                expire:2,
                status:1
            },function(data){
                console.log(data);
                if(!data.data)return;
                /*if($scope.hasUseCoupon){
                    angular.forEach(data.data,function(i){
                        if(i.trade_id == $stateParams.tid){
                            i.active = true;
                        }
                    });
                }*/
                if($scope.ids){
                    var arr = $scope.ids.split(",");
                    angular.forEach(data.data,function(i){
                        angular.forEach(arr,function(obj){
                            if(obj == i.id){
                                i.active = true;
                            }
                        });
                    });
                    console.log(data.data);
                }
                $scope.lastPage = data.last_page;
                $scope.leftTime(data.data);
                /*加载更多*/
                if(obj.type == "push"){
                    $scope.inviteData = $scope.inviteData.concat(data.data);
                }else{
                    $scope.inviteData = data.data;
                }
                loading.hide("couponList");
            },function(err){
                ErrorService.alert(err);
            });
        }
        CrowdFundingService["cf-trade-balance"].get({
            id:$stateParams.tid
        },function(data){
            console.log(data);
            if($scope.type != "deposit"){
                if(data.payment.amount_coupons > 0){
                    $scope.hasUseCoupon = true;
                    angular.forEach(data.trade_coupon,function(item){
                        item.active = true;
                        item.leftTime = "";
                    });
                    /*$scope.leftTime(data.trade_coupon);*/
                    $scope.inviteData = data.trade_coupon;
                    loading.hide("couponList");
                }else{
                    $scope.hasUseCoupon = false;
                    /*获取优惠劵数据*/
                    $scope.loadCoupon({
                        perPage:$scope.perPage,
                        page:$scope.pageNo
                    });
                }
            }
            $scope.tradeData = data;
        },function(err){
            ErrorService.alert(err);
        });
        /*优惠劵页数*/
        $scope.pageNo = 1;
        $scope.perPage = 8;
        $scope.lastPage = 0;

        /*加载更多优惠劵*/
        $scope.loadMore = function(){
            $scope.pageNo++;
            $scope.loadCoupon({
                perPage:$scope.perPage,
                page:$scope.pageNo,
                type:"push"
            });
        }
        $scope.ensure = function(){
            var ids = [];
            var calAmount = 0;
            angular.forEach($scope.inviteData,function(obj){
                if(obj.active){
                    ids.push(obj.id);
                    calAmount += parseInt(obj.amount);
                }
            });
            $scope.ids = ids.join(",");
            console.log($scope.ids+","+calAmount);
            var obj = calAmount ? {
                tid:$scope.tid,
                type:"balance",
                ids:$scope.ids,
                calAmount:calAmount
            } : {
                tid:$scope.tid,
                type:"balance",
                ids:$scope.ids,
            };
            $state.go("syndicatesPayWay",obj);
        }
    });

