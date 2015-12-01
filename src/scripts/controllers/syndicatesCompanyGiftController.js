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


        CrowdFundingService["activity"].get({
            id: "coupon",
            submodel: "batm",
            subid:'rank',
            activity_id:$stateParams.activity_id,
            uid:$scope.uid
        }, function(data) {
            $scope.rank = data.rank;
        },function(err){
        });

        var weixinshare = function(){
            var url = "/syndicatesCompany/weixinshare?uid="+$scope.uid;
            if($scope.giftMoney){
                url += '&isInvestor=true';
            }
            _hmt.push(['_trackPageview', url]);
            krtracker('trackPageView', url);
        };


        $scope.$watch('rank', function(from) {
            $scope.shareDesc = '做新锐互联网公司股东，认证即获2000现金';
            $scope.shareTitle = '下一站，股东！| ' + shareTileMap[$stateParams.activity_id];
            if($scope.isLogin && from) {
                if($stateParams.activity_id == 5){
                    $scope.shareTitle = '下一站，股东！| 我是阿里系第' + from + '个搭上股东直通车的VIP。'
                }
            }

            window.WEIXINSHARE = {
                shareTitle: $scope.shareTitle,
                shareDesc: $scope.shareDesc,
                shareImg: 'http://krplus-pic.b0.upaiyun.com/201511/16090813/bure3v9cy22gs04k.jpg',
                shareHref: location.protocol + '//' + location.host + '/m/#/syndicatesCompany?activity_id=' + $scope.activity_id
            };

            InitWeixin({
                success:weixinshare
            });
        });

    });
