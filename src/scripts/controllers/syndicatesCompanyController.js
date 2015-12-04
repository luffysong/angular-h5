/**
 * Controller Name: syndicatesInviteController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesCompanyController',
    function($scope, $state, $stateParams, $q, $modal, notify, $timeout, $interval, loading, UserService, CrowdFundingService, ErrorService) {
        document.title = '下一站，股东！|  阿里巴巴专';
        $scope.$on('$locationChangeStart', function() {
            document.title = '36氪股权融资';
        });
        var activityMap = {
            //'4' : 'baidu', //百度
            '5' : 'ali', //阿狸
            //'6' : 'tencent', //腾讯
            //'7' : 'xiaomi' //小米
        };
        $scope.activity_id = $stateParams.activity_id ||'';
        $scope.activity_id = $scope.activity_id.substr(0,1);
        $scope.isActivity = !!($scope.activity_id && activityMap[$scope.activity_id]);
        if(!$scope.isActivity) return false;

        $scope.companyImgUrl = 'styles/images/company/banner_' + activityMap[$scope.activity_id] + '.jpg';

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
        $scope.checkOffline = false;


        $scope.isLoading = true;

        $scope.emailFlag = true;
        $scope.email = '';

        //
        $scope.checkEmail = false;
        if($stateParams.skipstep){
            $scope.isLoading = false;
            $scope.checkEmail = true;
            $scope.checkOffline = false;
            $timeout(function(){
                window.scroll(0,$(window).width() * 1.17);

            },600);

        }

        //检查是否下线
        CrowdFundingService["activity"].get({
            id: "coupon",
            submodel: "activity-config",
            activity_id:$scope.activity_id
        },function(data) {
            if(data && data.info && data.info.is_over){
                $scope.checkOffline = true;
                $scope.isLoading = false;
            }else{
            }

        },function(err){
            ErrorService.alert(err);
            $scope.checkOffline = true;
            $scope.isLoading = false;
        });

        $scope.couponList = [];
        // 获取平台获奖信息
        CrowdFundingService['coupon'].get({
            per_page: 50,
            activity_id:$scope.activity_id
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
                    var top = $recordsItem.eq(0).outerHeight();

                    if(innerHeight <= outerHeight){

                    }else{
                        $recordsList.animate({
                            'scrollTop':top
                        },1000,'linear',function(){
                            console.log(222);
                            $recordsList.scrollTop(0);
                            $recordsItem.eq(0).appendTo($recordsList);
                        })
                    }
                }, 1200);
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

        var emailMap = {
            //'4':{
            //    'baidu.com':true
            //},
            '5':{
                'aliyun.com':true,
                'alibaba-inc.com':true,
                'taobao.com':true,
                'tmall.com':true,
                'alipay.com':true,
                'autonavi.com':true,
                'ucweb.com':true,
                'umeng.com':true,
                'xiami.com':true,
                'ttpod.com':true,
                'koubei.com':true
            }
            //'6':{
            //
            //},
            //'7':{
            //    'mi.com':true
            //}
        };

        $scope.doCheckEmail = function($event){
            var val = $scope.email;
            var suffix = val.split('@')[1];
            if(!(suffix && emailMap[$scope.activity_id][suffix])){
                $scope.emailFlag = false;
            }else{
                $scope.emailFlag = true;
            }
        }

        $scope.checkTxt = '验证';
        $scope.doPostEmail = function($event){
            $event.preventDefault();
            if($scope.email == ''){
                ErrorService.alert('填一下邮箱吧,不要太调皮哦!');
                return false;
            }
            if($scope.checkTxt == '验证中...')return false;
            $scope.checkTxt = '验证中...';
            CrowdFundingService["activity"].save({
                id: "coupon",
                submodel: "batm",
                subid:'get-coupon'
            },{
                company_email:$scope.email,
                activity_id:$scope.activity_id
            }, function(data) {
                $scope.checkTxt = '验证';
                $scope.rank = $scope.rank + 1;
                $state.go('syndicatesCompanyGift', {
                    id: $stateParams.activity_id
                });
            },function(err){
                $scope.checkTxt = '重新验证';
                ErrorService.alert(err);
            });

        }

        var checkCoupon = function(){

            CrowdFundingService["coupon"].get({
                activity_id:$scope.activity_id,
                uid:$scope.uid
            }, function(data) {
                if(data.data && data.data.length != 0){
                    $scope.checkEmail = false;
                    $scope.hasCoupon = true;
                }
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
            $scope.isLoading = false;
            $scope.checkIdentity = false;
        }


        var shareTileMap = {
            4:'',
            5:'阿里系员工财富直通车已经到站，等你搭乘。',
            6:'',
            7:''
        };
        CrowdFundingService["activity"].get({
            id: "coupon",
            submodel: "batm",
            subid:'rank',
            activity_id:$scope.activity_id,
            uid:$scope.uid
        }, function(data) {
            $scope.rank = data.rank;
        },function(err){
        });


        var weixinshare = function(){
            var url = "/syndicatesCompany/weixinshare?uid="+$scope.uid;
            if($scope.isInvestor){
                url += '&isInvestor=true';
            }
            _hmt.push(['_trackPageview', url]);
            krtracker('trackPageView', url);
        };

        $scope.$watch('rank', function(from) {
            $scope.shareDesc = '做新锐互联网公司股东，注册即获2000现金';
            $scope.shareTitle = '下一站，股东！| ' + shareTileMap[$stateParams.activity_id];
            if($scope.isLogin && from) {
                if($stateParams.activity_id == 5){
                    $scope.shareTitle = '下一站，股东！| 我是阿里系员工第' + from + '个搭上财富直通车的VIP。'
                }
            }

            window.WEIXINSHARE = {
                shareTitle: $scope.shareTitle,
                shareDesc: $scope.shareDesc,
                shareImg: 'https://krplus-normal.b0.upaiyun.com/201512/03120636/irh7rcuolj5t42wq.jpg',
                shareHref: location.protocol + '//' + location.host + '/m/#/syndicatesCompany?activity_id=' + $scope.activity_id
            };
            InitWeixin({
                success:weixinshare
            });
        });

        $scope.$watch('checkEmail', function(from) {
            if(from){
                _hmt.push(['_trackPageview', "/syndicatesCompany/checakEmail"]);
                krtracker('trackPageView', "/syndicatesCompany/checakEmail");
            }else{
                _hmt.push(['_trackPageview', "/syndicatesCompany/index"]);
                krtracker('trackPageView', "/syndicatesCompany/index");
            }
        });
});

