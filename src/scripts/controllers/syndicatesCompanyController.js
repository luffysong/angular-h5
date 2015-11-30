/**
 * Controller Name: syndicatesInviteController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesCompanyController',
    function($scope, $state, $stateParams, $q, $modal, notify, $timeout, $interval, loading, UserService, CrowdFundingService, ErrorService) {
        document.title = '合作推广计划';
        $scope.$on('$locationChangeStart', function() {
            document.title = '36氪股权融资';
        });
        var activityMap = {
            '4' : '11',
            '5' : '11',
            '6' : '11',
            '7' : '11'
        };
        $scope.activity_id = $stateParams.activity_id ||'';
        $scope.isActivity = !!($scope.activity_id && activityMap[$scope.activity_id]);
        if(!$scope.isActivity) return false;

        //loading.hide('syndicatesCompany');
        var wWidth = $(window).width();
        $scope.fontSize = 24/640 * (wWidth > 640 ? 640 : wWidth) ;




        // 登录状态
        $scope.uid = UserService.getUID();
        $scope.isLogin = !!$scope.uid;
        //是否获得过券
        $scope.hasCoupon = false;
        //是否是跟投人
        $scope.isInvestor = false;
        $scope.companyName = $stateParams.company || '';
        $scope.checkIdentity = true;

        //是否下线
        $scope.offline = true;
        $scope.checkOffline = true;

        $scope.checkOffline = false;
        $scope.offline = false;

        $scope.isLoading = true;

        //
        $scope.checkEmail = false;
        if($stateParams.skipstep){
            $scope.checkEmail = true;
            $scope.isLoading = false;
        }


        var checkCoupon = function(){

            CrowdFundingService["coupon"].get({
                activity_id:$scope.activity_id,
                uid:$scope.uid
            }, function(data) {
                $scope.isLoading = false;
                $scope.checkIdentity = false;
            },function(err){
                $scope.isLoading = false;
                $scope.checkIdentity = false;
            });
        }


        if($scope.isLogin) {
            UserService.getIdentity(function (data) {
                if(!data.coInvestor) {
                    CrowdFundingService["audit"].get({
                        id: "co-investor",
                        submodel: "info"
                    }, function(data) {
                        $scope.isLoading = false;
                        $scope.checkIdentity = false;
                    },function(err){
                        if(err.code == 1002){
                            checkCoupon();
                            $scope.isInvestor = true;
                        }else {
                            $scope.isLoading = false;
                            $scope.checkIdentity = false;
                        }

                    });
                }else{
                    $scope.isInvestor = true;
                    checkCoupon();
                }
            });
        }else{
            $scope.checkIdentity = false;
        }


        $scope.companyImgUrl = '/styles/images/company/banner_ali.jpg';

        //return;
        //$scope.formUserNmae = '';
        //if($scope.isLogin) {
        //    if(from) {
        //        $scope.shareTitle = '我是' + from + '，请你来拿300元现金，一起做土豪！';
        //        $scope.shareDesc = '来新锐互联网公司当股东，顺便领钱！';
        //        $scope.formUserNmae = from;
        //    } else {
        //        $scope.shareTitle = '36氪限时福利】立得200元现金，加入富豪养成！';
        //        $scope.shareDesc = '【36氪限时福利】立得200元现金，加入富豪养成！';
        //    }
        //} else {
        //    $scope.shareTitle = '【36氪限时福利】立得200元现金，加入富豪养成！';
        //    $scope.shareDesc = '来新锐互联网公司当股东，顺便领钱！';
        //}
        //
        //window.WEIXINSHARE = {
        //    shareTitle: $scope.shareTitle,
        //    shareDesc: $scope.shareDesc,
        //    shareImg: 'http://krplus-pic.b0.upaiyun.com/201511/16090813/bure3v9cy22gs04k.jpg',
        //    shareHref: location.protocol + '//' + location.host + '/m/#/syndicatesInvite?id=' + ($scope.isLogin ? $scope.uid : $stateParams.id)
        //};
        //
        //InitWeixin();
});
