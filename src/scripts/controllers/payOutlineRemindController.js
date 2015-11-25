/**
 * Controller Name: syndicatesPayOutlineController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('payOutlineRemindController',
    function($scope, UserService, ErrorService, $stateParams, CrowdFundingService,$state) {
        $scope.tid = $stateParams.tid;
        $scope.type = $stateParams.type;
        $scope.couponIds = $stateParams.couponIds;
        $scope.interFace = {
            deposit:"cf-trade-deposit",
            balance:"cf-trade-balance"
        };
        $scope.cancel = function(){
            history.go(-1);
           /*if($scope.fId){
               $state.go("");
           }*/
        }
        $scope.payOutline = function(){
            CrowdFundingService[$scope.interFace[$scope.type]].update({
                id: $scope.tid
            }, {
                platform_type: 1
            }, function() {

                var offpayUrl = encodeURIComponent("https://" + location.host + '/m/#/zhongchouPayOutline?tid=' + $scope.tid + '&type=' + $scope.type);
                var url = '//' + location.host+'/p/payment/1/send-payment-request?' +
                    (['trade_id='+$scope.tid,
                        'url_order=',
                        'coupon_ids='+ $scope.couponIds,
                        "back_url=",
                        'offpay_url=' + offpayUrl].join('&'));
                window.location.href = url;
            }, function(err) {
                ErrorService.alert(err);
            });
        }
    });
