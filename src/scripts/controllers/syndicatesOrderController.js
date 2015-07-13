/**
 * Controller Name: ApplyProvisionController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesOrderController',
    function($scope, UserService, ErrorService, $stateParams,DictionaryService,CrowdFundingService,CoInvestorService,$state) {
        $scope.companyId = $stateParams.cid;
        $scope.fundingId = $stateParams.fundingId;
        $scope.showAll = false;
        $scope.uid = UserService.getUID();
        $scope.bankDetails = DictionaryService.getDict('bank_limit_lianlianpay');
        CoInvestorService['my-financing'].query({
            company_id:$scope.companyId,
            status:  0,
            per_page:100,
            page: 1
        },function(data){
            console.log(data);
            $scope.listData =data.data;
            /*过滤数据，去除线下汇款订单*/
            angular.forEach($scope.listData,function(obj,index){
                if(obj.payment.platform_type == 1){
                    $scope.listData.splice(index,1);
                }
            });
            $scope.tempData = angular.copy($scope.listData).slice(0,3);
        }, function(){
        });
        /*用户签约信息查询*/
        CrowdFundingService["payment"].get({
            id:3,
            submodel:"user-bankcard",
            subid:$scope.uid,
            pay_type:"D"
        },function(data){
            console.log(data);
            if(data.agreement_list.length){
                $scope.hasRecord = true;
            }else{
                $scope.hasRecord = false;
            }
        },function(err){
            ErrorService.alert(err);
            $scope.hasRecord = false;
        });
        $scope.viewAll = function(){
            $scope.tempData = $scope.listData;
            $scope.showAll = true;
        }
        $scope.goPay = function(tid,amount){
            if(!$scope.hasRecord){
                window.open('//'+location.host+'/p/payment/3/send-payment-request?'+(['pay_type=D','trade_id='+tid,'url_order='+encodeURIComponent(location.href),'back_url='+encodeURIComponent(location.href)]).join('&'));
            }else{
                $state.go("syndicatesPay",{
                    tid:tid,
                    amount:amount
                });
            }
        }
    });

