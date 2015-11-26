/**
 * Controller Name: syndicatesInviteController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('SyndicatesInviteController',
    function($scope, $state, $stateParams, $q, $modal, notify, $timeout, $interval, loading, UserService, CrowdFundingService, ErrorService, DictionaryService, CoInvestorService) {
        document.title = '富豪养成计划';
        $scope.$on('$locationChangeStart', function() {
            document.title = '36氪股权融资';
        });

        loading.show('syndicatesInvite');

        $timeout(function() {
            window.scroll(0, 0);
            loading.hide('syndicatesInvite');
        }, 500);


        // 登录状态
        $scope.uid = UserService.getUID();
        $scope.isLogin = !!$scope.uid;

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
            if($scope.uid) {
                CrowdFundingService['co-investor'].get({
                    id: "my-spred-list",
                    activity_id: 2
                }, function(data) {
                    console.log(data);
                    $scope.inviteList = data.data;

                    $modal.open({
                        windowClass: 'invite-record-window',
                        templateUrl: 'templates/syndicates/invite/pop-invite-record.html',
                        controller: [
                            '$scope', 'scope', '$modalInstance',
                            function($scope, scope, $modalInstance) {
                                $scope.inviteList = scope.inviteList;
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
                }, function(err) {
                    ErrorService.alert(err);
                });
            }
        };

        // 微信分享
        $scope.shareDesc = '';
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



        $scope.formUserNmae = '';
        $scope.$watch('uname', function(from) {
            if($scope.isLogin) {
                if(from) {
                    $scope.shareTitle = '我是' + from + '，请你来拿300元现金，一起做土豪！';
                    $scope.shareDesc = '来新锐互联网公司当股东，顺便领钱！';
                    $scope.formUserNmae = from;
                } else {
                    $scope.shareTitle = '36氪限时福利】立得200元现金，加入富豪养成！';
                    $scope.shareDesc = '【36氪限时福利】立得200元现金，加入富豪养成！';
                }
            } else {
                $scope.shareTitle = '【36氪限时福利】立得200元现金，加入富豪养成！';
                $scope.shareDesc = '来新锐互联网公司当股东，顺便领钱！';
            }

            window.WEIXINSHARE = {
                shareTitle: $scope.shareTitle,
                shareDesc: $scope.shareDesc,
                shareImg: 'http://krplus-pic.b0.upaiyun.com/201511/16090813/bure3v9cy22gs04k.jpg',
                shareHref: location.protocol + '//' + location.host + '/m/#/syndicatesInvite?id=' + ($scope.isLogin ? $scope.uid : $stateParams.id)
            };

            InitWeixin();
        });
});

