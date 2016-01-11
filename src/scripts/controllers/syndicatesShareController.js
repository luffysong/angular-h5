/**
 * Controller Name: syndicatesShareController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('SyndicatesShareController',
    function($scope, $state, $stateParams, $modal, notify, $timeout, loading, UserService, CrowdFundingService, ErrorService, DictionaryService, CoInvestorService) {
        loading.show("syndicatesShare");

        document.title = '来36氪做股东';
        $scope.$on('$locationChangeStart', function() {
            document.title = '36氪股权融资';
        });

        $timeout(function() {
            loading.hide("syndicatesShare");
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

                        if(data.status == 1 ) {

                        } else {
                            $state.go('syndicatesValidate', {
                                inviter_id: $stateParams.id
                            });
                        }

                    }, function(err) {

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

        // 分享
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

