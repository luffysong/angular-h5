/**
 * Controller Name: syndicatesGiftController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('SyndicatesGiftController',
    function($scope, $state, $stateParams, $modal, notify, $timeout, loading, UserService, CrowdFundingService, ErrorService, DictionaryService, CoInvestorService) {
        loading.show("syndicatesGift");

        $timeout(function() {
            loading.hide("syndicatesGift");
        }, 1500);

        // 登录状态
        $scope.uid = UserService.getUID();
        $scope.isLogin = !!UserService.getUID();

        // 跟投人身份
        if($scope.isLogin) {
            UserService.getIdentity(function (data) {
                if(data && data.coInvestor) {
                    $scope.permit = "coInvestor";
                } else {
                    CrowdFundingService["audit"].get({
                        id:"co-investor",
                        submodel:"info"
                    }, function(data) {
                    }, function(err) {
                        if(err.code == 1002) {
                            $scope.permit = "preInvestor";
                        } else {
                            $state.go('syndicatesValidate');
                        }
                    });
                }
            });
        }
    });

