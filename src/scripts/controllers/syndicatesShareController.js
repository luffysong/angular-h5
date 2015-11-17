/**
 * Controller Name: syndicatesShareController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('SyndicatesShareController',
    function($scope, $state, $stateParams, $modal, notify, $timeout, loading, UserService, CrowdFundingService, ErrorService, DictionaryService, CoInvestorService) {
        loading.show("syndicatesShare");

        document.title = '富豪养成计划';

        $timeout(function() {
            loading.hide("syndicatesShare");
        }, 1500);

        // 登录状态
        $scope.uid = UserService.getUID();
        $scope.isLogin = !!$scope.uid;

        // 跟投人身份
        if($scope.isLogin) {
            UserService.getIdentity(function (data) {
                if(data && data.coInvestor) {
                    $scope.permit = "coInvestor";
                } else {
                    if(data && data.code == 4031) {
                        $state.go('syndicatesValidate', {
                            inviter_id: $stateParams.id
                        });
                    } else {
                        CrowdFundingService["audit"].get({
                            id: "co-investor",
                            submodel: "info"
                        }, function(data) {
                            if(data.cert_info && data.cert_info.length == 0) {
                                $state.go('syndicatesValidate', {
                                    inviter_id: $stateParams.id
                                });
                            }
                        }, function(err) {
                            if(err.code == 1002) {
                                $scope.permit = "preInvestor";
                            } else {
                                $state.go('syndicatesValidate', {
                                    inviter_id: $stateParams.id
                                });
                            }
                        });
                    }
                }
            });

            // 获取用户信息
            UserService.basic.get({
                id: $scope.uid
            }, function(data){
                $scope.uname = data.name;
            }, function(err) {
                console.log(err);
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

        var shareDesc = '';
        if($scope.isLogin) {
            if($scope.uname) {
                shareDesc = '我是' + $scope.uname + '，这是我的富豪养成计划，马上加入投资立减最高1000元。';
            } else {
                shareDesc = '加入36氪股权投资富豪养成计划，投资马上立减最高1000元。';
            }
        } else {
            shareDesc = '加入36氪股权投资富豪养成计划，投资马上立减最高1000元。';
        }

        window.WEIXINSHARE = {
            shareTitle: '36氪股权投资富豪养成计划',
            shareDesc: shareDesc,
            shareImg: 'http://krplus-pic.b0.upaiyun.com/201511/16090813/bure3v9cy22gs04k.jpg',
            shareHref: location.protocol + '//' + location.host + location.pathname + '&id=' + $scope.uid
        };

        InitWeixin();
    });

