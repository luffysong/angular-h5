/**
 * Controller Name: syndicatesInviteController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('SyndicatesInviteController',
    function($scope, $state, $stateParams, $q, $modal, notify, $timeout, $interval, loading, UserService, CrowdFundingService, ErrorService, DictionaryService, CoInvestorService,$cookies) {
        document.title = '来36氪做股东';
        $scope.$on('$locationChangeStart', function() {
            document.title = '36氪股权融资';
        });

        loading.show('syndicatesInvite');

        $timeout(function() {
            window.scroll(0, 0);
            loading.hide('syndicatesInvite');
        }, 500);

        var $bar = $('.J_appDownloadWrapper');
        if($bar.length > 0) {
            $bar.hide();
        }


        // 登录状态
        $scope.uid = UserService.getUID();
        $scope.isLogin = !!$scope.uid;

        // 邀请人 ID
        $scope.inviterId = $stateParams.id;
        if($scope.inviterId && (!$cookies.uid_inviter || $scope.uid != $scope.inviterId)){
            //过期时间一个月
            $cookies.uid_inviter = $scope.inviterId;
        }
        // 跟投人身份
        if($scope.isLogin) {

            UserService.getIdentity(function (data) {
                if(!data.coInvestor) {
                    CrowdFundingService["audit"].get({
                        id: "co-investor",
                        submodel: "info"
                    }, function(data) {

                        if( data.status == 1 || data.status == 2 ) {
                            $scope.isCoInvestor = true;
                        } else {
                            $scope.isCoInvestor = false;
                        }
                    }, function(err) {

                    });
                } else {
                    $scope.isCoInvestor = true;
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
                    $scope.shareTitle = '【36氪限时福利】我是' + from + '，请你来拿1000元投资现金，一起做股东！';
                    $scope.shareDesc = '投资新锐互联网公司，获得高收益！';
                    $scope.formUserNmae = from;
                } else {
                    $scope.shareTitle = '【限时福利】来36氪，做股东，立得1000元！';
                    $scope.shareDesc = '投资新锐互联网公司，获得高收益！';
                }
            } else {
                $scope.shareTitle = '【限时福利】来36氪，做股东，立得1000元！';
                $scope.shareDesc = '投资新锐互联网公司，获得高收益！';
            }

            window.WEIXINSHARE = {
                shareTitle: $scope.shareTitle,
                shareDesc: $scope.shareDesc,
                shareImg: 'https://krplus-pic.b0.upaiyun.com/201512/04094947/x0bjnbw0hra8nne8.jpg',
                shareHref: location.protocol + '//' + location.host + '/m/#/syndicatesInvite?id=' + ($scope.isLogin ? $scope.uid : $stateParams.id)
            };

            InitWeixin();
        });
});

