/**
 * Controller Name: ApplyProvisionController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesAllOrderController',
    function($scope, $stateParams, DictionaryService, CrowdFundingService, CoInvestorService, $state, ErrorService) {
        $scope.activeIndex = 0;
        $scope.noMore = true;
        $scope.noData = false;

        /*条目数量和页码*/
        var pageSize = 10;
        $scope.pageNo = 1;

        /*获取订单数据*/
        $scope.queryData = function() {
            CoInvestorService['my-financing'].query({
                'page' : $scope.pageNo,
                'per_page': pageSize
            }, function(data){
                if($scope.orderData && $scope.pageNo > 1) {
                    for(var i = 0, length = data.data.length; i < length; i++) {
                        $scope.orderData.push(data.data[i]);
                    }
                    $scope.loadingMore = false;
                } else {
                    $scope.orderData = data.data;
                }

                if(!$scope.orderData || !$scope.orderData.length) {
                    $scope.noData = true;
                    $scope.queryRecommend();
                } else {
                    $scope.noMore = data.total <= pageSize * $scope.pageNo;
                }
            }, function(err) {
                $scope.noData = true;
                $scope.queryRecommend();
            });
        };

        /*首次加载第一页10条订单数据*/
        $scope.queryData();

        /*众筹列表加载更多*/
        $scope.loadMore = function(){
            if($scope.loadingMore) return;
            $scope.loadingMore = true;
            $scope.pageNo += 1;
            $scope.queryData();
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
    });

