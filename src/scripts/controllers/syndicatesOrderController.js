/**
 * Controller Name: ApplyProvisionController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesOrderController',
    function($scope, UserService, $stateParams,DictionaryService,CrowdFundingService,CoInvestorService,$state,loading) {
        loading.show("syndicatesOrder");
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
            $scope.listData =data.data;
            $scope.tempData = [];
            /*过滤数据，去除线下汇款订单*/
            angular.forEach($scope.listData,function(obj,index){
                if(obj.payment.platform_type != 1 && obj.payment.status == 1 && obj.trade_c_f_deposit && obj.trade_c_f_deposit.deposit && obj.trade_c_f_deposit.payment.status == 1 && obj.trade_c_f_deposit.payment.platform_type != 1){
                    $scope.tempData.push(obj);
                }
            });
            $scope.tempList = $scope.tempData.slice(0);
            $scope.tempData = $scope.tempData.slice(0,3);
            loading.hide("syndicatesOrder");
        }, function(){
        });
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
        $scope.viewAll = function(){
            $scope.tempData = $scope.tempList;
            $scope.showAll = true;
        }
        $scope.goPay = function(tid,amount){
            $state.go("syndicatesPayWay",{
                tid:tid,
                amount:amount,
                type:"deposit"
            });
            /*if(!$scope.hasRecord){
                location.href = '//'+location.host+'/p/payment/3/send-payment-request?'+(['pay_type=D','trade_id='+tid,'url_order='+encodeURIComponent(location.href),'back_url='+encodeURIComponent(location.href)]).join('&');
            }else{
                $state.go("syndicatesPay",{
                    tid:tid,
                    amount:amount
                });
            }*/
        }
    });

