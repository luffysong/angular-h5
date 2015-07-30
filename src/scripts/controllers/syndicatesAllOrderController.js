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

        /*获取订单数据*/
        $scope.queryData = function(params){
            CoInvestorService['my-financing'].query(params,function(data){
                if(!data.data.length){
                    $scope.noData = true;
                    $scope.orderData = data.data;
                    return;
                }else{
                    $scope.noData = false;
                    $scope.orderData = data.data;
                    $scope.noMore = data.data.length < pageSize ? true : false;
                }
            }, function(err){
                ErrorService.alert(err);
            });
        }
        /*首次加载默认查询全部数据*/
        $scope.queryData();
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
                var params = {};
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
            return params;
        }
        /*众筹列表加载更多*/
        $scope.loadMore = function(){
            var params = {
                page:1,
                per_page:100
            };
            CoInvestorService['my-financing'].query($scope.buildParams(params),function(data){
                if(data.data.length){
                    $scope.orderData = $scope.orderData.concat(data.data.slice(10,data.data.length));
                }
                $scope.noMore = true;
            }, function(err){
                ErrorService.alert(err);
            });
        }
    });

