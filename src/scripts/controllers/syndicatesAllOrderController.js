/**
 * Controller Name: ApplyProvisionController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesAllOrderController',
    function($scope, UserService, $stateParams,DictionaryService,CrowdFundingService,CoInvestorService,$state,ErrorService) {
        $scope.companyId = $stateParams.cid;
        $scope.fundingId = $stateParams.fundingId;
        $scope.uid = UserService.getUID();
        $scope.activeIndex = 0;
        $scope.noMore = true;
        $scope.noData = false;
        /*每页几条数据*/
        var pageSize = 10;
        $scope.pageNo = 1;
        $scope.orderStatus = [
            {
                name:"全部",
                active:true
            },{
                name:"待付款",
                active:false,
                payment_status:1
            },{
                name:"已付款",
                active:false,
                payment_status:3
            },{
                name:"已成功",
                active:false,
                status:2
            }
        ];
        var tempData = [];
        /*获取订单数据*/
        $scope.queryData = function(params) {
            CoInvestorService['my-financing'].query(params, function(data){
                if(!data.data || !data.data.length) {
                    $scope.noData = true;
                    $scope.orderData = data.data;
                } else {
                    tempData = data.data.slice(0);
                    /*过滤数据，去除线下付款订单*/
                    angular.forEach(data.data, function(obj, index) {
                        if(obj.payment && obj.payment.platform_type == 1) {
                            tempData.splice(index, 1);
                        }
                    });
                    $scope.noMore = tempData.length <= pageSize;
                    $scope.orderData = tempData.slice(0, 10);

                    $scope.noData = $scope.orderData.length ? false : true;

                    if($scope.noData) {
                        $scope.queryRecommend();
                    }
                }
            }, function(err) {
                $scope.noData = true;
                $scope.queryRecommend();
            });
        };

        /*查询推荐众筹列表*/
        $scope.queryRecommend = function() {
            CrowdFundingService["crowd-funding"].query({
                "page": 1,
                "per_page": 3
            },function(data){
                if(!data.total || !data.per_page) return;
                $scope.recommendList = data.data;
                $scope.handleData();
            },function(err){
                ErrorService.alert(err);
            });
        };

        /*处理数据*/
        var statusList = DictionaryService.getDict("crowd_funding_status");
        $scope.handleData = function() {
            angular.forEach($scope.recommendList, function(key, index) {
                if(key.status != 25 && (key.status == 50 || new Date(key.end_time) < new Date() || (key.min_investment && key.min_investment > key.cf_max_raising - key.cf_success_raising) || key.investor_count >= key.max_coinvestor_number)){
                    key.timeout = true;
                }

                angular.forEach(statusList, function(obj, i) {
                    if(key.status == obj.value){
                        key.name = obj.desc;
                        key.color = obj.value;
                        if(key.status == 30 || key.status == 35){
                            var startTime = new Date(key.start_time);
                            if(new Date() < startTime){
                                key.fundingStatus = "preheat";
                                var minute = startTime.getMinutes() > 9 ? startTime.getMinutes() : "0"+startTime.getMinutes();
                                key.name = parseInt(startTime.getMonth())+1+"月"+startTime.getDate()+"日  " + "  开始融资";
                                key.color = 60;
                            }
                        } else if(key.status == 25) {
                            key.name = "预热中";
                        }
                    }
                });
            });
        };

        /*首次加载默认查询全部数据*/
        $scope.queryData({
            page:1,
            per_page:100
        });
        /*选择不同条件查询订单*/
        $scope.selectStatus = function(index){
            if(index == $scope.activeIndex){
                return;
            }else{
                $scope.activeIndex = index;
                angular.forEach($scope.orderStatus,function(obj,index){
                    obj.active = false;
                })
                $scope.orderStatus[index].active = true;
                var params = {
                };
                $scope.queryData($scope.buildParams(params));
            }
        }
        /*组装参数*/
        $scope.buildParams = function(params){
            if($scope.orderStatus[$scope.activeIndex].payment_status){
                params.payment_status = $scope.orderStatus[$scope.activeIndex].payment_status;
            }else{
                delete params.payment_status;
            }
            if($scope.orderStatus[$scope.activeIndex].status){
                params.status = $scope.orderStatus[$scope.activeIndex].status;
            }else{
                delete params.status;
            }
            params.page = 1;
            params.per_page = 100;
            return params;
        }
        /*众筹列表加载更多*/
        $scope.loadMore = function(){
            $scope.orderData = tempData;
            $scope.noMore = true;
        }
    });

