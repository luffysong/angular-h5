/**
 * Controller Name: ApplyProvisionController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesAllOrderController',
    function($scope, $stateParams, DictionaryService, CrowdFundingService, CoInvestorService, $state, ErrorService, $modal) {
        $scope.activeIndex = 0;
        $scope.noMore = true;
        $scope.noData = false;

        /*条目数量和页码*/
        var pageSize = 10;
        $scope.pageNo = 1;

        /*获取订单数据*/
        $scope.queryData = function(params) {
            CoInvestorService['my-financing'].query({
                'page' : params.pageNo ? params.pageNo : $scope.pageNo,
                'per_page': params.pageSize ? params.pageSize : pageSize
            }, function(data){
                if($scope.orderData && $scope.pageNo > 1 && !params.refresh) {
                    for(var i = 0, length = data.data.length; i < length; i++) {
                        $scope.orderData.push(data.data[i]);
                    }
                    $scope.loadingMore = false;
                } else {
                    $scope.orderData = data.data;
                }

                angular.forEach($scope.orderData, function(obj, index){
                    obj.created_at = moment(obj.created_at).format('YYYY-MM-DD');
                    if (obj.trade_c_f_deposit.payment.status == 3) {
                        obj.trade_c_f_deposit.refund_timeout = !(moment(obj.trade_c_f_deposit.payment.notify_time).add(3, 'days') - moment());
                    }

                    if (obj.trade_c_f_balance.payment.status == 3) {
                        obj.trade_c_f_balance.refund_timeout = !(moment(obj.trade_c_f_balance.payment.close_time) - moment());
                    }
                });

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
        $scope.queryData({});

        /*众筹列表加载更多*/
        $scope.loadMore = function(){
            if($scope.loadingMore) return;
            $scope.loadingMore = true;
            $scope.pageNo += 1;
            $scope.queryData({});
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

        /*取消订单*/
        $scope.cancelOrder = function(orderId) {
            $modal.open({
                templateUrl: 'templates/syndicates/pop-order.html',
                windowClass: 'remind-modal-window',
                controller: [
                    '$scope', 'scope', '$modalInstance', '$state', 'ErrorService', 'notify',
                    function($scope, scope, $modalInstance, $state, ErrorService, notify) {
                        $scope.isCancelOrder = 1;

                        $scope.ok = function() {
                            CrowdFundingService['cf-trade'].put({
                                id: orderId
                            }, {
                                status: 8
                            }, function(res) {
                                notify({
                                    message: '取消订单成功',
                                    classes: 'alert-success'
                                });

                                scope.queryData({
                                    'pageNo': 1,
                                    'pageSize': scope.orderData.length,
                                    'refresh': true
                                });
                                $modalInstance.dismiss();
                            }, function(err) {
                                ErrorService.alert(err);
                                $modalInstance.dismiss();
                            });
                        };

                        $scope.cancel = function() {
                            $modalInstance.dismiss();
                        }
                    }
                ],
                resolve: {
                    scope: function() {
                        return $scope;
                    }
                }
            });
        };

        /*申请退款*/
        $scope.askForRefund = function(tradeId) {
            $modal.open({
                 templateUrl: 'templates/syndicates/pop-order.html',
                 windowClass: 'remind-modal-window',
                 controller: [
                     '$scope', 'scope', '$modalInstance', '$state', 'RefundService', 'ErrorService',
                     function($scope, scope, $modalInstance, $state, RefundService, ErrorService) {
                        $scope.isRefundModal = 1;

                        $scope.ok = function() {
                            RefundService.post({
                                'trade_id': tradeId
                            }, function(res) {
                                scope.queryData({
                                    'pageNo': 1,
                                    'pageSize': scope.orderData.length,
                                    'refresh': true
                                });

                                $modalInstance.dismiss();
                            }, function(err) {
                                ErrorService.alert(err);
                                $modalInstance.dismiss();
                            });
                        };

                        $scope.cancel = function() {
                            $modalInstance.dismiss();
                        }
                     }
                 ],
                 resolve: {
                     scope: function() {
                         return $scope;
                     }
                 }
            });
        };
    });

