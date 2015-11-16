/**
 * Controller Name: syndicatesShareController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('SyndicatesShareController',
    function($scope, $state, $stateParams, $modal, notify, $timeout, loading, UserService, CrowdFundingService, ErrorService, DictionaryService, CoInvestorService) {
        loading.show("syndicatesShare");

        $timeout(function() {
            loading.hide("syndicatesShare");
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
                    if(data && data.code == 4031) {
                        $state.go('syndicatesValidate');
                    } else {
                        CrowdFundingService["audit"].get({
                            id: "co-investor",
                            submodel: "info"
                        }, function(data) {
                        }, function(err) {
                            if(err.code == 1002) {
                                $scope.permit = "preInvestor";
                            } else {
                                $state.go('syndicatesValidate');
                            }
                        });
                    }
                }
            });
        }

        // 分享
        $scope.share = function($event) {
            $event.preventDefault();
            $modal.open({
                windowClass: 'invite-share-window',
                templateUrl: 'templates/syndicates/invite/pop-invite-share.html',
                controller: [
                    '$scope', '$modalInstance',
                    function($scope, $modalInstance) {
                        $scope.ok = function() {
                            $modalInstance.dismiss();
                        }
                    }]
            });
        };

        window.WEIXINSHARE = {
            shareTitle: '分享标题',
            shareDesc: '分享描述',
            shareImg: '分享小图',
            shareLink: location.protocol + '//' + location.host + '/m/#/syndicatesInvite' + '&id=' + $scope.uid
        };

        InitWeixin();
    });

