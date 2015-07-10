/**
 * Controller Name: ApplyProvisionController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesPayController',
    function($scope, UserService, ErrorService, $stateParams,DictionaryService,CrowdFundingService,CoInvestorService,$state) {
        $scope.uid = UserService.getUID();
        $scope.tid = $stateParams.tid;
        $scope.amount = $stateParams.amount;
        $scope.bankDetails = DictionaryService.getDict('bank_limit_lianlianpay');
        /*用户签约信息查询*/
        CrowdFundingService["payment"].get({
            id:3,
            submodel:"user-bankcard",
            subid:$scope.uid,
            pay_type:"D"
        },function(data){
            console.log(data);
            $scope.bankData = data;
            angular.forEach($scope.bankData.agreement_list,function(obj,index){
                angular.extend(obj,$scope.bankDetails[obj.bank_code][$scope.bankDetails[obj.bank_code].length-1]);
            });
        },function(err){
            console.log(err);
            $scope.hasRecord = false;
        });
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

