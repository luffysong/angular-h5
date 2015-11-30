/**
 * Controller Name: syndicatesGiftController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesCompanyGiftController',
    function($scope, $state, $stateParams, $modal, notify, $timeout, loading, UserService, CrowdFundingService, ErrorService, DictionaryService, CoInvestorService) {

        document.title = '富豪养成计划';
        $scope.$on('$locationChangeStart', function() {
            document.title = '36氪股权融资';
        });

        // 登录状态
        $scope.uid = UserService.getUID();
        $scope.isLogin = !!UserService.getUID();


        // 跟投人身份
        if($scope.isLogin) {
            CrowdFundingService["coupon"].get({
                activity_id: $stateParams.id || '',
                uid: $scope.uid || ''
            }, function(data) {
                if(data.data && data.data.length == 0){
                    $state.go('syndicatesCompany', {
                        activity_id: $stateParams.id
                    });
                }else{
                    // 奖励
                    $scope.giftMoney = data.data[0].amount;
                    loading.hide("syndicatesGift");
                }
            }, function(err) {
                $state.go('syndicatesCompany', {
                    activity_id: $stateParams.id
                });
            });
        }else{
            $state.go('syndicatesCompany', {
                activity_id: $stateParams.id
            });
        }
    });
