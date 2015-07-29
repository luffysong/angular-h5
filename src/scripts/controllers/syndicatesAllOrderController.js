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
        /*每页几条数据*/
        var pageSize = 30;
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
                console.log(data);
                $scope.orderData = data.data;
                $scope.noMore = data.current_page == data.last_page ? true : false;
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
                angular.forEach($scope.orderStatus,function(obj,index){
                    obj.active = false;
                })
                $scope.orderStatus[index].active = true;
                var params = {};
                if($scope.orderStatus[index].payment_status){
                    params.payment_status = $scope.orderStatus[index].payment_status;
                }else{
                    delete params.payment_status;
                }
                $scope.activeIndex = index;
                if($scope.orderStatus[index].status){
                    params.status = $scope.orderStatus[index].status;
                }else{
                    delete params.status;
                }
                $scope.queryData(params);
            }
        }
        /*众筹列表加载更多*/
        /*$scope.loadMore = function(){
            $scope.pageNo++;
            CoInvestorService['my-financing'].query({
            },function(data){
                console.log(data);
                $scope.orderData = data.data;
                $scope.noMore = data.current_page == data.last_page ? true : false;
            }, function(err){
                ErrorService.alert(err);
            });
        }*/
    });

