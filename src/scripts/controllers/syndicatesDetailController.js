/**
 * Controller Name: ApplyProvisionController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesDetailController',
    function($scope, UserService, $modal, ErrorService, $stateParams,DictionaryService,CrowdFundingService,notify,CompanyService,$timeout,$state,$rootScope,CoInvestorService, $cookies,$sce,loading) {
        loading.show("syndicatesDetail");
        if(navigator.userAgent.match(/mac/i)){
            $scope.system = "ios";
        }else{
            $scope.system = "android";
        }
        var statusList = DictionaryService.getDict("crowd_funding_status");
        // 手续进度是否可见
        $scope.canSeeProcedure = false;

        /*是否开始播放视频*/
        $scope.startPlay = false;
        $scope.startVideo = function(){
            $scope.startPlay = true;
        }
        /*股权结构是否出错*/
        $scope.shareError = false;
        /*众筹信息是否全部展开*/
        $scope.isToggle = false;
        $scope.showAll = false;
        $scope.coInvestor = {};
        $scope.fundingId = $rootScope.fundingId = $stateParams.fundingId;
        $scope.companyId = $rootScope.companyId = $stateParams.companyId;
        $scope.orderData = [];
        $scope.uid = UserService.getUID();
        document.title="36氪股权投资";
        /**
         * 用户跳转回来的是否已认证，决定是否跳转到<跟投人认证>页面
         */
        if($scope.uid && !!$stateParams.checkValid) {
            UserService.isProfileValid(function(data) {
                if(!data) {
                    $state.go('guide.welcome', {from:encodeURIComponent(location.href), type: 'investorValidate'});
                } else {
                    UserService.getIdentity(function(data){
                        if(!data.coInvestor) {
                            $state.go("investorValidate");
                        }
                    });
                }
            });
        } else {
            /*获取用户是否为跟投人*/
            UserService.getIdentity(function(data) {
                if(data.code == 4031){
                    $scope.invalid = true;
                    if(!$stateParams.checkValid){

                    }
                    /*ErrorService.alert({
                        msg:"请先完善资料"
                    });
                    $timeout(function(){
                        $state.go("investorValidate");
                    },5000);*/
                }else if(data) {
                    if(data.coInvestor) {
                        $scope.isCoInvestor = true;
                    } else {
                        $scope.isCoInvestor = false;
                    }
                } else {
                    $scope.isCoInvestor = false;
                }
            },function(err) {
                ErrorService.alert(err);
            });
        }

        /*订单按钮*/
        $scope.myOrder = function(event){
            if(!$scope.uid){
                event.preventDefault();
            }
            else if($scope.invalid){
                event.preventDefault();
                $state.go('guide.welcome', {
                    type: 'investorValidate'
                });
            }
            else if(!$scope.isCoInvestor){
                if(event){
                    event.preventDefault();
                }
                $state.go("investorValidate");
            }
        }
        $scope.wantInvest = function(event){
            if(!$scope.uid)return;
            if($scope.invalid){
                event.preventDefault();
                $state.go('guide.welcome', {
                    type: 'investorValidate'
                });
            }
            else if(!$scope.isCoInvestor){
                if(event){
                    event.preventDefault();
                }
                $state.go("investorValidate");
            }else if($scope.noOrder){
                $state.go("syndicatesConfirm",{
                    cid:$scope.companyId,
                    fundingId:$scope.fundingId
                });
            }else{
                $state.go("syndicatesOrder",{
                    cid:$scope.companyId,
                    fundingId:$scope.fundingId
                });
            }
        }
        /*未登录点击我要投资进入登录界面跳转回操作*/
        if($stateParams.login){
            UserService.getIdentity(function(data){
                if(data.code == 4031){
                    ErrorService.alert({
                        msg:"请先完善资料"
                    });
                    $timeout(function(){
                        $state.go('investorValidate');
                    },5000);
                }else if(data){
                    if(data.coInvestor){
                        $scope.isCoInvestor = true;
                    }else{
                        $scope.isCoInvestor = false;
                        $scope.wantInvest();
                    }
                }else{
                    $scope.isCoInvestor = false;
                    $scope.wantInvest();
                }
            },function(err){
                ErrorService.alert(err);
            });
        }
        /*播放器种类及固定url*/
        var player = {
            "qq":{
                "url":"//v.qq.com/iframe/player.html?vid="
            }
        };
        /*视频链接处理*/
        $scope.handleVideo = function(link){
            if(!link || link.split("?").length <= 1)return;
            var temp = [],str;
            var arr = link.split("?")[1].split("&");
            angular.forEach(arr,function(obj){
                if(obj.split("=")[0] == "uu" || obj.split("=")[0] == "vu"){
                    temp.push(obj);
                }
            });
            temp.push("width="+$(window).width());
            temp.push("height=250");
            str = "https://"+projectEnvConfig.rongHost+"/p/video/letv/iframe-h5?"+temp.join("&");
            console.log(str);
            /*var vid = "";
            link = link.split("?")[0];
            var arr = link.split("/");
            vid = arr[arr.length-1].split(".")[0];
            Object.keys(player).forEach(function(key){
                if(link.indexOf(key) >= 0){
                    link = player[key].url+vid;
                }
            });*/
            return $sce.trustAsResourceUrl(str);
        }
        /*项目问答点击展开收起*/
        $scope.toggleQuestion = function(index){
            angular.forEach($scope.problemData,function(obj,i){
                if(i != index){
                    obj.isHide = true;
                }
            });
            $scope.problemData[index].isHide = !$scope.problemData[index].isHide;
        }

        /*获取公司基本信息*/
        CompanyService.get({
            id:$scope.companyId
        },function(data){
            $scope.companyData = data;
            document.title=data.basic.name + " | 36氪";
            WEIXINSHARE = {
                shareTitle: data.basic.name + " | 36氪",
                shareDesc: data.basic.brief || data.basic.name,
                shareImg: data.basic.logo || 'http://img.36tr.com/logo/20140520/537aecb26e02d'
            };
            InitWeixin();
        },function(err){
            ErrorService.alert(err);
        });
        /*获取众筹详情*/
        CrowdFundingService["crowd-funding"].get({
            id:$scope.fundingId
        },function(data){
            $scope.color = data.base.status;
            $scope.syndicatesInfo = data;

            if($scope.syndicatesInfo.co_investors){
                if($scope.syndicatesInfo.co_investors.length > 8){
                    $scope.tempData = angular.copy($scope.syndicatesInfo.co_investors);
                    $scope.syndicatesInfo.co_investors = $scope.syndicatesInfo.co_investors.slice(0,8);
                }else{
                    $scope.tempData = angular.copy($scope.syndicatesInfo.co_investors);
                    $scope.showAll = true;
                }

                // 查看手续进度权限
                $scope.syndicatesInfo.co_investors.filter(function(item) {
                    if(item.user_id == $scope.uid) {
                        return $scope.canSeeProcedure = true;
                    }
                });
            }
            angular.forEach(statusList,function(obj,index){
                if(obj.value == data.base.status){
                    $scope.status = obj.desc;
                    var startTime = new Date(data.base.start_time);
                    /*/!*超募中*!/
                    if(data.base.cf_success_raising > data.base.cf_raising && data.base.cf_raising > 0){
                        $scope.status = "超募中";
                    }*/
                    /*预热中*/
                    if(new Date() < startTime && $scope.color == 30){
                        $scope.fundingStatus = "preheat";
                        //var minute = date.getMinutes() > 9 ? date.getMinutes() : "0"+date.getMinutes();
                        /*$scope.status = (parseInt(date.getMonth())+1)+"月"+date.getDate()+"日  "+date.getHours()+":"+minute+" 开始融资";*/
                        var minute = startTime.getMinutes() > 9 ? startTime.getMinutes() : "0"+startTime.getMinutes();
                        $scope.status = "锚定中 " + (parseInt(startTime.getMonth())+1)+"月"+startTime.getDate()+"日  "+startTime.getHours()+":"+minute+"  开放募资";
                        $scope.color = 60;
                    }
                }
            });
            /*保密预热状态发布*/
            if($scope.color == 25){
                $scope.secret = true;
                $scope.status = "预热中";
            }
            if($scope.syndicatesInfo.base){
                if(parseInt($scope.syndicatesInfo.base.cf_success_raising_offer) === 0 || !$scope.syndicatesInfo.base.cf_success_raising_offer || !$scope.syndicatesInfo.base.cf_raising){
                    $scope.syndicatesInfo.base.percent = 0;
                }else{
                    $scope.syndicatesInfo.base.percent = (parseInt($scope.syndicatesInfo.base.cf_success_raising_offer) * 100 / parseInt($scope.syndicatesInfo.base.cf_raising)).toFixed(0);
                }
                /*
                 停止投资三种情况：
                 1.众筹超时
                 2.剩余投资金额不足
                 3.跟投人达到最多跟投人数
                 * */
                if(new Date($scope.syndicatesInfo.base.end_time) < new Date()){
                    $scope.timeout = true;
                }
            }
            /*if($scope.syndicatesInfo.co_investors && $scope.syndicatesInfo.base.max_coinvestor_number <= $scope.syndicatesInfo.co_investors.length){
                $scope.timeout = true;
            }*/
            if(!$scope.syndicatesInfo.detail)return;
            /*视频链接处理*/
            if($scope.syndicatesInfo.detail.com_video_link){
                $scope.videoLink = $scope.handleVideo($scope.syndicatesInfo.detail.com_video_link);
            }
            /*项目问答数据*/
            $scope.problemData = $scope.syndicatesInfo.detail.project_qa;
            if($scope.problemData && $scope.problemData.length){
                angular.forEach($scope.problemData,function(obj,index){
                    obj.isHide = true;
                });
            }
            $scope.shareError = $scope.syndicatesInfo.detail.es_funding_team * 1 + $scope.syndicatesInfo.detail.es_investor * 1 + $scope.syndicatesInfo.detail.es_staff * 1 == 100 ? false : true;
            var chartData = [$scope.syndicatesInfo.detail.es_investor,$scope.syndicatesInfo.detail.es_funding_team,$scope.syndicatesInfo.detail.es_staff];
            angular.forEach($scope.chartConfig.series[0].data,function(obj,index){
                if(chartData[index] == 0){
                    $scope.chartConfig.series[0].data.splice(index,1);
                }else{
                    obj[1] = chartData[index];
                }
            });
            $timeout(function(){
                loading.hide("syndicatesDetail");
            },500);
        },function(err){
            ErrorService.alert(err);
        });
        /*过往投资方数据获取*/
        CompanyService['past-finance'].query({
            id:$stateParams.companyId
        },{},function(data){
            if(data.data && data.data.length){
                $scope.pastInvestor = data.data;
                angular.forEach($scope.pastInvestor,function(obj){
                    if(!obj.investDate)return;
                    var date = new Date(obj.investDate);
                    obj.investTime = date.getFullYear()+"."+(parseInt(date.getMonth())+1);
                });
            }
        },function(err){
            ErrorService.alert(err);
        });

        $scope.loadInvestor = function(){
            $scope.syndicatesInfo.co_investors = $scope.tempData;
            $scope.showAll = true;
        };
        /*展开更多众筹信息*/
        $scope.toggleMore = function(){
            $scope.isToggle = true;
        };
        /*底部栏点击我要投资*/
        $scope.toInvest = function(){
            $state.go("syndicatesConfirm");
        };
        /*开投提醒*/
        $scope.setRemind = function(event) {
            event.stopPropagation();
            if(!UserService.getUID()) {
                location.href = "/user/login?from=" + encodeURIComponent(location.href);
                return;
            }
            if($scope.syndicatesInfo.base.has_reminder) {
                ErrorService.alert({
                    msg: "你已设置过提醒"
                });
                return;
            } else {
                $modal.open({
                    templateUrl: 'templates/company/pop-set-remind.html',
                    windowClass: 'remind-modal-window',
                    controller: [
                        '$scope', '$modalInstance','scope','UserService','CrowdFundingService',
                        function ($scope, $modalInstance, scope, UserService, CrowdFundingService, $timeout) {
                            UserService.getPhone(function(data) {
                                if(!data) return;
                                $scope.phone = data.slice(0,3)+"****"+data.slice(data.length-4,data.length);
                            });
                            $scope.ok = function() {
                                CrowdFundingService.save({
                                    model:"crowd-funding",
                                    id:scope.fundingId,
                                    submodel:"opening-remind"
                                }, {

                                }, function(data) {
                                    notify({
                                        message:"设置成功",
                                        classes:'alert-success'
                                    });
                                    scope.syndicatesInfo.base.has_reminder = true;
                                    $modalInstance.dismiss();
                                },function(err) {
                                    ErrorService.alert(err);
                                    $modalInstance.dismiss();
                                });
                            };
                            $scope.cancel = function() {
                                $modalInstance.dismiss();
                            }
                        }
                    ],
                    resolve: {
                        scope: function() {
                            return $scope;
                        }
                    }
                });
            }
        };
        /*认证跟投人*/
        $scope.investorVal = function(event){
            if($scope.invalid){
                event.preventDefault();
                $state.go('guide.welcome', {
                    type: 'investorValidate'
                });
            }
        }
        /*查看BP*/
        $scope.openBp = function(){
            $modal.open({
                templateUrl: 'templates/company/pop-all-protocol.html',
                windowClass: 'remind-modal-window',
                controller: [
                    '$scope', '$modalInstance','scope',
                    function ($scope, $modalInstance, scope) {
                        $scope.modalBg = scope.syndicatesInfo.detail.file_business_plan_img;
                        $scope.ok = function(){
                            $modalInstance.dismiss();
                        }
                    }
                ],
                resolve: {
                    scope: function(){
                        return $scope;
                    }
                }
            });
        }
        $scope.krCode = function(){
            if(!UserService.getUID()){
                location.href = "/user/login?from=" + encodeURIComponent(location.href);
                return;
            }else if(!$scope.isCoInvestor){
                $state.go("investorValidate");
            }else if($scope.noOrder){
                $state.go("syndicatesConfirm",{
                    cid:$scope.companyData.company.id,
                    fundingId:$scope.fundingId
                });
            }else{
                $state.go("syndicatesOrder",{
                    cid:$scope.companyId,
                    fundingId:$scope.fundingId
                });
            }
        }
        /*status为1时，为待付保证金订单*/
        CoInvestorService['my-financing'].query({
            company_id:$scope.companyId,
            per_page:100,
            status:1,
            payment_status:1,
            page: 1
        },function(data){
            /*过滤数据，去除线下汇款订单*/
            angular.forEach(data.data,function(obj,index){
                //obj.payment.platform_type != 1 &&
                if(obj.payment.status == 1 && obj.trade_c_f_deposit){
                    $scope.orderData.push(obj);
                }
            });
            if(!$scope.orderData.length){
                $scope.noOrder = true;
            }
        }, function(){
        });

        //股权结构
        $scope.stockStructure = {};
        $scope.chartConfig = {
            size:{
                height:180
            },
            options: {
                //This is the Main Highcharts chart config. Any Highchart options are valid here.
                //will be overriden by values specified below.
                /*chart: {
                    width:540
                },*/
                tooltip: {
                    style: {
                        padding: 10,
                        fontWeight: 'bold'
                    },
                    formatter: function () {
                        return this.key + "　" + this.y+"%";
                    }
                },

                colors: ['#01af94','#ff7777', '#ffb24f'],

                plotOptions: {
                    pie: {
                        size:"90%",
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false
                        },
                        showInLegend: true,
                        point: {
                            events: {
                                legendItemClick: function () {
                                    return false; // <== returning false will cancel the default action
                                }
                            }
                        }
                    }
                },

                legend: {
                    align: 'right',
                    verticalAlign: 'middle',
                    layout: 'vertical',
                    itemMarginBottom: 10,
                    labelFormatter: function () {
                        return this.name + "　" + this.y+"%";
                    }
                }
            },
            //The below properties are watched separately for changes.

            //Series object (optional) - a list of series using normal highcharts series options.
            series: [{
                type: 'pie',
                name: 'Browser share',
                borderWidth: 0,
                data: [
                    ['投资人',56],
                    ['创始团队',12],
                    ['员工持股',32]
                ]
            }],


            //Title configuration (optional)
            title: {
                text: ''
            }
        };

        /**
         * 金蛋理财活动
         *
         * 产品逻辑：
         *
         * 几种状态： 登录/未登录 完善资料/未完善资料 跟投人/非跟投人
         *
         * 流程：
         *
         * 1. 未登录情况：进入活动页面 -> 弹框显示“我要领取” -> 按钮导航“登录/注册” -> 跳转活动页或者完善资料页 -> 跳回活动页面
         * 2. 已登录情况：进入活动页面 -> 弹框显示“我要领取” -> <是否跟投人？> 是 -> 按钮点击后显示手机号输入 -> 点击“立即领取”领奖 -> 显示领奖结果
         *                                                   |                                                          +
         *                                                   +                                                          |
         *                                                   否 --------> 按钮点击后显示认证页面 -> 弹框显示“我要领取” -> 点击“立即领取”领奖
         *
         * TODO:
         * 1. 弹框显示逻辑和不显示逻辑，尤其是后者，可能需要对应的接口 :-) 与后端同学商定使用 cookie
         * 2. 后端接口现在为虚拟接口
         * 3. 金蛋理财识别现在依靠 fundingId，但是还不明确线上数据库中得 fundingId
         *
         * @conditions: fundingId 为金蛋理财对应的 fundingID
         */
        /*
        if ($scope.fundingId == 105 && (!$cookies.goldEggClear || $cookies.goldEggClear != 'clear.' + UserService.getUID())) {

            var expires = new Date();
            expires.setDate(expires.getDate() + 10);
            var registSrc = /^egg-(web|app)$/.test($stateParams.source) ? 'egg' : '';
            if (registSrc == 'egg') {
                document.cookie = 'regist_src=' + registSrc + '; expires=' + expires.toGMTString();
            }
            krtracker("trackPageView", '金蛋理财活动', "来源：" + $stateParams.source + " | 操作：" + "进入金蛋理财详情页面");

            $timeout(function() {
                $modal.open({
                    templateUrl: 'templates/syndicates/pop-gold-egg.html',
                    windowClass: 'gold-egg-modal',
                    controller: [
                        '$scope', '$modalInstance', 'scope', 'UserService', 'CrowdFundingService', '$stateParams',
                        function ($scope, $modalInstance, scope, UserService, CrowdFundingService, $stateParams) {
                            $scope.source = $stateParams.source;
                            // 获取用户 id
                            $scope.userId = UserService.getUID();
                            // 获取用户是否登录
                            $scope.isLogin = !!$scope.userId;
                            // 用户手机号码 & mask
                            $scope.user = {
                                phone: "",
                                phoneMask: ""
                            };
                            UserService.getPhone(function(phone) {
                                if(!phone) return;
                                $scope.user.phone = phone;
                                $scope.user.phoneMask = phone.slice(0,3) + "****" + phone.slice(phone.length - 4, phone.length);
                            });
                            // 获取用户是否为跟投人
                            UserService.get({
                                id: 'identity',
                                sub: 'cert',
                                subid: 'coinvestor-info'
                            },{},function(data) {
                            },function(err) {
                                if(!err) return;
                                if(err.code == 1001) {
                                    $scope.isCoInvestor = false;
                                } else if(err.code == 1002 || err.code == 1003) {
                                    $scope.isCoInvestor = true;
                                    krtracker('trackEvent', '金蛋理财活动', "来源：" + $stateParams.source + " | 操作：" + "用户已经是跟投人");
                                } else {
                                    $scope.isCoInvestor = false;
                                }
                            });
                            // 获取用户是否完善资料
                            UserService.isProfileValid(function(data) {
                                $scope.isProfileValided = data;
                            });

                            $scope.showForm = false;
                            $scope.isValidateAction = false;
                            $scope.showFormAction = function() {
                                $scope.showForm = true;
                                krtracker('trackEvent', '金蛋理财活动', "来源：" + $stateParams.source + " | 操作：" + "点击弹框 - 进行奖品领取");
                            };
                            // 领取奖品操作
                            $scope.earn = function() {
                                krtracker('trackEvent', '金蛋理财活动', "来源：" + $stateParams.source + " | 操作：" + "领取奖励 - 提交手机号");
                                CrowdFundingService.save({
                                    model:"crowd-funding",
                                    submodel:"jindan-gift"
                                }, {
                                    "phone": $scope.user.phone
                                }, function(data) {
                                    if (!data) return;
                                    switch(data.type) {
                                        case 1:
                                            $scope.welcomeText = '恭喜您：';
                                            $scope.prizeTitle = '领取2万元金蛋理财特权本金';
                                            $scope.nextText = '登录金蛋理财App完成投资即可领取';
                                            krtracker('trackEvent', '金蛋理财活动', "来源：" + $stateParams.source + " | 操作：" + "获得奖励 - 2万元金蛋理财特权本金");
                                            break;
                                        case 2:
                                            $scope.welcomeText = '恭喜您：';
                                            $scope.prizeTitle = '领取3000元金蛋理财特权本金';
                                            $scope.nextText = '登录金蛋理财App完成投资即可领取';
                                            krtracker('trackEvent', '金蛋理财活动', "来源：" + $stateParams.source + " | 操作：" + "获得奖励 - 3000元金蛋理财特权本金");
                                            break;
                                        case 3:
                                            $scope.welcomeText = '很抱歉，本活动礼包仅限：';
                                            $scope.prizeTitle = '2015年8月1日0点前36Kr注册用户领取';
                                            $scope.nextText = '您可以下载金蛋理财App，完成新手任务，即得最高1万元特权本金哦！';
                                            $scope.titleSmaller = 'smaller';
                                            krtracker('trackEvent', '金蛋理财活动', "来源：" + $stateParams.source + " | 操作：" + "获得奖励 - 获取奖励失败");
                                            break;
                                    }
                                    $scope.resultView = true;
                                    var expires = new Date();
                                    expires.setYear(expires.getFullYear() + 1);
                                    document.cookie = 'goldEggClear=clear.' + $scope.userId + '; expires=' + expires.toGMTString();
                                }, function(err) {
                                    ErrorService.alert(err);
                                    krtracker('trackEvent', '金蛋理财活动', "来源：" + $stateParams.source + " | 操作：" + "获得奖励 - 获取奖励失败");
                                });
                            };

                            // 关闭弹框操作
                            $scope.close = function() {
                                $modalInstance.dismiss();
                            };

                            // 统计来源
                            $scope.uaStatistics = function(str) {
                                krtracker('trackEvent', '金蛋理财活动', "来源：" + $stateParams.source + " | 操作：" + str);
                            };
                        }
                    ],
                    resolve: {
                        scope: function() {
                            return $scope;
                        }
                    }
                });
            }, 500);
        }
        */
    });

