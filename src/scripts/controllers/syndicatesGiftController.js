/**
 * Controller Name: syndicatesGiftController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('SyndicatesGiftController',
    function($scope, $state, $stateParams, $modal, notify, $timeout, loading, UserService, CrowdFundingService, ErrorService, DictionaryService, CoInvestorService) {
        loading.show("syndicatesGift");

        document.title = '来36氪做股东';
        $scope.$on('$locationChangeStart', function() {
            document.title = '36氪股权融资';
        });

        $timeout(function() {
            window.scroll(0,0);
            loading.hide("syndicatesGift");
        }, 500);

        // 登录状态
        $scope.uid = UserService.getUID();
        $scope.isLogin = !!UserService.getUID();

        // 奖励
        $scope.giftMoney = $stateParams.id ? 300 : 200;

        // 跟投人身份
        if($scope.isLogin) {
            UserService.getIdentity(function (data) {
                if(!data.coInvestor) {
                    CrowdFundingService["audit"].get({
                        id: "co-investor",
                        submodel: "info"
                    }, function(data) {
                        $state.go('syndicatesValidate', {
                            inviter_id: $stateParams.id
                        });
                    }, function(err) {
                        if(err.code == 1002) {

                        } else {
                            $state.go('syndicatesValidate', {
                                inviter_id: $stateParams.id
                            });
                        }
                    });
                }
            });
        }
    });

