/**
 * Controller Name: syndicatesGiftController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesCompanyGiftController',
    function($scope, $state, $stateParams, $modal, notify, $timeout, loading, UserService, CrowdFundingService, ErrorService, DictionaryService, CoInvestorService) {

        document.title = '下一站，股东！|  阿里巴巴专场';
        $scope.$on('$locationChangeStart', function() {
            document.title = '36氪股权融资';
        });

        // 登录状态
        $scope.uid = UserService.getUID();
        $scope.isLogin = !!UserService.getUID();

        $scope.giftMoney =0;
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

                    $.each((data.data || []), function(index, el){
                        $scope.giftMoney += parseInt(el.amount);
                    })

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

        var shareTileMap = {
            4:'',
            5:'阿里系员工财富直通车已经到站，等你搭乘',
            6:'',
            7:''
        };
        CrowdFundingService["activity"].get({
            id: "coupon",
            submodel: "batm",
            subid:'rank',
            activity_id:$stateParams.id,
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

            $scope.shareDesc = '做新锐互联网公司股东，注册即获2000现金';
            $scope.shareTitle = '下一站，股东！| ' + shareTileMap[$stateParams.id];

            if($scope.isLogin && from) {
                if($stateParams.id == 5){
                    $scope.shareTitle = '下一站，股东！| 我是阿里系员工第' + from + '个搭上财富直通车的VIP。'
                }
            }

            window.WEIXINSHARE = {
                shareTitle: $scope.shareTitle,
                shareDesc: $scope.shareDesc,
                shareImg: 'https://krplus-normal.b0.upaiyun.com/201512/03120636/irh7rcuolj5t42wq.jpg',
                shareHref: location.protocol + '//' + location.host + '/m/#/syndicatesCompany?activity_id=' + $stateParams.id
            };
            InitWeixin({
                success:weixinshare
            });
        });
        $scope.rank = 0;

        _hmt.push(['_trackPageview', "/syndicatesCompany/gift"]);
        krtracker('trackPageView', "/syndicatesCompany/gift");

    });
