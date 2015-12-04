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
                    $scope.shareDesc = '我是' + from + '，这是我的富豪养成计划。点我获得1000元投资现金，上不封顶！';
                    $scope.shareTitle = from + '的富豪养成计划';
                } else {
                    $scope.shareDesc = '立刻加入36氪股权投资富豪养成计划，点我获得1000元投资现金，上不封顶！';
                    $scope.shareTitle = '36氪股权投资 · 富豪养成计划';
                }
            } else {
                $scope.shareDesc = '立刻加入36氪股权投资富豪养成计划，点我获得1000元投资现金，上不封顶！';
                $scope.shareTitle = '36氪股权投资 · 富豪养成计划';
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

