/**
 * Controller Name: syndicatesInviteController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('SyndicatesInviteController',
    function($scope, $state, $stateParams, $q, $modal, notify, $timeout, $interval, loading, UserService, CrowdFundingService, ErrorService, DictionaryService, CoInvestorService) {
        document.title = '36氪股权投资';

        $timeout(function(){
            window.scroll(0, 0);
            loading.show('syndicatesInvite');
        }, 0);


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

        // 获取平台获奖信息
        CrowdFundingService['coupon'].get({
            per_page: 50
        },function(data) {
            $scope.couponList = data.data;
            loading.hide('syndicatesInvite');
            $scope.scroll();
        },function(err) {
            ErrorService.alert(err);
        });

        // 获奖信息滚动显示
        var timer, scrollStart;
        $scope.scroll = function() {
            scrollStart = true;

            $timeout(function() {
                timer = $interval(function() {
                    var $recordsList = $('.records-list');
                    var $recordsItem = $recordsList.find('li');
                    var outerHeight = $recordsList.height();
                    var innerHeight = $recordsItem.height() * $recordsItem.length;

                    var scrollTop = $recordsList.scrollTop();
                    if(outerHeight + scrollTop >= innerHeight){
                        scrollTop -= (innerHeight / 2) + 10;
                    } else {
                        scrollTop++;
                    }
                    $recordsList.scrollTop(scrollTop);
                }, 30);
            }, 100);
        };

        // 控制滚动信息停止和开始
        $scope.scrollClick = function(){
            if(scrollStart) {
                scrollStart = false;
                $interval.cancel(timer);
            } else {
                scrollStart = false;
                $scope.scroll();
            }
        };

        // 弹出个人获奖记录
        $scope.viewInviteRecord = function($event) {
            $event.preventDefault();
            $modal.open({
                windowClass: 'invite-record-window',
                templateUrl: 'templates/syndicates/invite/pop-invite-record.html',
                controller: [
                    '$scope', 'scope', '$modalInstance', 'CrowdFundingService', 'ErrorService',
                    function($scope, scope, $modalInstance, CrowdFundingService, ErrorService) {
                        if(scope.uid) {
                            CrowdFundingService['co-investor'].get({
                                id: 'my-spred-list'
                            }, function(data) {
                                $scope.inviteList = data.data;
                            }, function(err) {
                                ErrorService.alert(err);
                            });
                        }

                        $scope.ok = function() {
                            $modalInstance.dismiss();
                        }
                    }],
                    resolve: {
                        scope: function() {
                            return $scope;
                        }
                    }
            });
        };

        // 微信分享
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
            shareTitle: '36氪股权投资富豪养成计划',
            shareDesc: $scope.isLogin ? '我是' + $scope.uname + '，这是我的富豪养成计划，马上加入投资立减最高1000元。' : '加入36氪股权投资富豪养成计划，投资马上立减最高1000元。',
            shareImg: 'http://krplus-pic.b0.upaiyun.com/201511/16090813/bure3v9cy22gs04k.jpg',
            shareLink: location.protocol + '//' + location.host + location.pathname + '&id=' + ($scope.isLogin ? $scope.uid : $stateParams.id)
        };

        InitWeixin();
});

