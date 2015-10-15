/**
 * Controller Name: syndicatesPayOutlineController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesPayOutlineController',
    function($scope, UserService, ErrorService, $stateParams, CrowdFundingService) {
        /* 获取用户信息 */
        UserService.getMyEmail(function(email){
            $scope.myEmail = email;
        });
        $scope.interFace = {
            deposit:"cf-trade-deposit",
            balance:"cf-trade-balance"
        };
        $scope.orderType = $stateParams.type;
        if(!$scope.orderType)return;

        /* 根据订单类型调相应接口 */
        CrowdFundingService[$scope.interFace[$scope.orderType]].get({
            id:$stateParams.tid
        },function(data){
            $scope.tradeData = data;
        },function(err){
            ErrorService.alert(err);
        });
    });
