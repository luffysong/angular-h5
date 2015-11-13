/**
 * Controller Name: syndicatesInviteController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('SyndicatesInviteController',
    function($scope, $state, $stateParams, $q, $modal, notify, $timeout, $interval, loading, UserService, CrowdFundingService, ErrorService, DictionaryService, CoInvestorService) {
        loading.show('syndicatesInvite');

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
                            $state.go('syndicatesValid');
                        }
                    });
                }
            });
        }

        CrowdFundingService['coupon'].get({
            per_page: 50
        },function(data) {
            $scope.couponList = data.data;
            loading.hide('syndicatesInvite');
            $scope.scroll();
        },function(err) {
            ErrorService.alert(err);
        });

        var timer, scrollStart;
        $scope.scroll = function() {
            scrollStart = true;

            $timeout(function() {
                timer = $interval(function() {
                    var $recordsList = $('.records-list');
                    var $recordsItem = $recordsList.find('li');
                    var outterHeight = $recordsList.height();
                    var innerHeight = $recordsItem.height() * $recordsItem.length;

                    var scrollTop = $recordsList.scrollTop();
                    if(outterHeight + scrollTop >= innerHeight){
                        scrollTop -= (innerHeight / 2) + 10;
                    } else {
                        scrollTop++;
                    }
                    $recordsList.scrollTop(scrollTop);
                }, 30);
            }, 100);
        };

        $scope.scrollClick = function(){
            if(scrollStart) {
                scrollStart = false;
                $interval.cancel(timer);
            } else {
                scrollStart = false;
                $scope.scroll();
            }
        };

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
            shareTitle: $scope.shareTitle,
            shareDesc: $scope.shareDesc,
            shareImg: $scope.shareImg,
            shareLink: location.href
        };

        InitWeixin();
});

