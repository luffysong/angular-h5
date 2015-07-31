/**
 * Controller Name: SearchController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('InvestorValidateController',

    function($scope, SearchService,DictionaryService,ErrorService,DefaultService,$upload,checkForm,$timeout,UserService,AndroidUploadService, $interval,$modal) {
        $timeout(function(){
            window.scroll(0,0);
        },0);
        document.title="36氪股权众筹";
        WEIXINSHARE = {
            shareTitle: "36氪股权众筹",
            shareDesc: "成为跟投人",
            shareImg: 'http://krplus-pic.b0.upaiyun.com/36kr_new_logo.jpg'
        };
        InitWeixin();
        $scope.stageList = [];
        $scope.areaList = [];
        $scope.user = {
            investMoneyUnit:"CNY",
            rnvInvestorInfo:"V1_1",
            identityCardType: 'IDCARD',
            investPhases:[]
        };
        $scope.intro = {};
        $scope.basic = {
            value:{}
        };
        $scope.intro.value = {
            intro:"",
            pictures:""
        };
        $scope.valStatus = "normal";
        $scope.hasClick = false;
        /*投资阶段*/
        $scope.investStage = DictionaryService.getDict('FundsPhase').filter(function(item) {
            return item.value != "UNKNOWN";
        });
        /*关注领域*/
        $scope.fieldsOptions = DictionaryService.getDict('InvestorFollowedIndustry');
        /*自然人投资条件*/
        $scope.condition = DictionaryService.getDict("RnvInvestorInfo");
        /*地区*/
        $scope.addr1Options = DictionaryService.getLocation();
        $scope.addr2Options = [];
        /*跟投人认证信息回写*/
        UserService.get({
            id:'identity',
            sub: 'cert',
            subid: 'coinvestor-info'
        },{},function(data){
            if(data.userCoinvestorCertInfo){
                $scope.user.reIdCardNumber = data.userCoinvestorCertInfo.idCardNumber;
                if(data.userCoinvestorCertInfo.businessCardUrl){
                    $scope.intro.value.pictures = data.userCoinvestorCertInfo.businessCardUrl;
                }
            }
            angular.extend($scope.user,data.userCoinvestorCertInfo);
            /*真实姓名不回写*/
            $scope.user.name = "";

        },function(err){
            if(err.code == 1001){
                /*多次跟投人认证失败*/
                $scope.valStatus = "fail";
            }else if(err.code == 1002){
                /*正在审核中*/
                $scope.valStatus = "validating";
            }else if(err.code == 1003){
                /*已经是跟投人*/
                $scope.valStatus  = "withoutVal";
            }
        });
        /*获取用户信息填充表单*/
        UserService.basic.get({
            id:UserService.getUID()
        },function(data){
            angular.extend($scope.user, data);
            $scope.user.name = "";
            $scope.user.investMoneyBegin = parseInt(data.investMoneyBegin);
            $scope.user.investMoneyEnd = parseInt(data.investMoneyEnd);
            /*关注领域数据处理*/
            if($scope.user.industry && $scope.user.industry.length){
                angular.extend($scope.areaList,$scope.user.industry);
                angular.forEach($scope.user.industry,function(o,i){
                    angular.forEach($scope.fieldsOptions,function(key,index){
                        if(key.value == o){
                            key.active = true;
                        }
                    });
                });
            }
            /*投资阶段数据处理*/
            angular.forEach($scope.user.investPhases,function(val,key){
                angular.forEach($scope.investStage,function(obj,index){
                    if(obj.value == val){
                        obj.active = true;
                    }
                });
            });
            $scope.basic.value.address1 = $scope.user.country;
            $scope.basic.value.address2 = $scope.user.city;
        },function(err){
            ErrorService.alert(err);
        });
        /*选择所在地事件*/
        $scope.addr1Change = function() {
            if ($scope.basic.value) {
                $scope.basic.value.address2 = "";
                $scope.basic.value.address3 = "";
            }
        };
        $scope.$watch('basic.value.address1', function(value) {
            $scope.addr2Options = [];
            if (!value) {
                return;
            }
            $scope.addr2Options = DictionaryService.getLocation(value);
        });
        $scope.selectStage = function(index){
            angular.element($("form[name='investorValidateForm']")).scope()["investorValidateForm"].$setValidity("stageEmpty",true);
            $scope.investStage[index].active = !$scope.investStage[index].active;
        }
        $scope.selectArea = function(index){
            if($scope.areaList.length == 3 && $scope.areaList.indexOf($scope.fieldsOptions[index].value) < 0){
                return;
            }else{
                $scope.areaList = [];
                $scope.fieldsOptions[index].active = !$scope.fieldsOptions[index].active;
                angular.forEach($scope.fieldsOptions,function(obj,i){
                    if(obj.active && $scope.areaList.indexOf($scope.fieldsOptions[i].value) < 0){
                        $scope.areaList.push($scope.fieldsOptions[i].value);
                    }
                });

            }
            if($scope.areaList.length)angular.element($("form[name='investorValidateForm']")).scope()["investorValidateForm"].$setValidity("industyEmpty",true);
        }
        /*确认身份证号失去焦点事件*/
        $scope.enterId = function(){
            if(!$scope.user.reIdCardNumber)return;
            $scope.enterCard = true;
        }


        //android客户端
        $scope.androidUpload = AndroidUploadService.setClick(function(filename){
            $scope.$apply(function(){
                $scope.intro.value.pictures = filename;
            })

        });

        /*上传名片*/
        $scope.imgFileSelected  = function(files, e){
            var upyun = window.kr.upyun;
            if(files[0].size > 5 * 1024 * 1024){
                ErrorService.alert({
                    msg:"图片大于5M"
                });
                return;
            }
            $scope.intro.value.pictures = "";
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $scope.intro.uploading = true;
                $scope.intro.progress = 0;
                DefaultService.getUpToken({
                    'x-gmkerl-type': 'fix_width', //限定宽度,高度自适应
                    'x-gmkerl-value': '900',      //限定的宽度的值
                    'x-gmkerl-unsharp': true
                }).then(function (data) {
                    $scope.upload = $upload.upload({
                        url: upyun.api + '/' + upyun.bucket.name,
                        data: data,
                        file: file,
                        withCredentials: false
                    }).progress(function (evt) {
                        $scope.intro.progress = evt.loaded * 100 / evt.total;
                    }).success(function (data, status, headers, config) {
                        var filename = data.url.toLowerCase();
                        if(filename.indexOf('.jpg') != -1 || (filename.indexOf('.png') != -1) || filename.indexOf('.jpeg') != -1) {
                            $scope.intro.value.pictures = window.kr.upyun.bucket.url + data.url;
                        } else {
                            ErrorService.alert({
                                msg: '格式不支持，请重新上传！'
                            });
                        }
                        $scope.intro.uploading = false;
                    }).error(function(){
                        ErrorService.alert({
                            msg: '格式不支持，请重新上传！'
                        });
                        $scope.intro.uploading = false;
                    });
                }, function (err) {
                    $scope.intro.uploading = false;
                    ErrorService.alert(err);
                });
            }
        };
        $timeout(function(){
            $scope.$watch("[user.reIdCardNumber,user.idCardNumber]",function(from){
                if(angular.element($("form[name='investorValidateForm']")).length > 0){
                    if(from[0] != from[1]){
                        angular.element($("form[name='investorValidateForm']")).scope()["investorValidateForm"].$setValidity("idcardInvalid",false);
                    }else{
                        angular.element($("form[name='investorValidateForm']")).scope()["investorValidateForm"].$setValidity("idcardInvalid",true);
                    }
                }
            });
        },500);

        /*查看风险揭示书*/
        $scope.seeRisk = function(){
            $modal.open({
                templateUrl: 'templates/company/pop-risk-tip-all.html',
                windowClass: 'remind-modal-window',
                controller: [
                    '$scope', '$modalInstance','scope',
                    function ($scope, $modalInstance, scope) {
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
        /*查看用户服务协议*/
        $scope.seeProtocol = function () {
            $modal.open({
                templateUrl: 'templates/company/pop-service-protocol.html',
                windowClass: 'remind-modal-window',
                controller: [
                    '$scope', '$modalInstance','scope',
                    function ($scope, $modalInstance, scope) {
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
        /*表单提交*/
        $scope.submitForm = function(){
            if($scope.user.idCardNumber != $scope.user.reIdCardNumber){
                $scope.enterCard = true;
                $('html,body').stop().animate({scrollTop: $("input[name='reIdCardNumber']").offset().top-100}, 400, function () {
                });
                return;
            }
            /*初始化*/
            $scope.user.investPhases = [];
            angular.forEach($scope.investStage,function(key,index){
                if(key.active && $scope.user.investPhases.indexOf(key.value) < 0){
                    $scope.user.investPhases.push(key.value);
                }
            });
            if(!checkForm("investorValidateForm"))return;
            if(!$scope.user.investPhases.length){
                angular.element($("form[name='investorValidateForm']")).scope()["investorValidateForm"].$setValidity("stageEmpty",false);
                $('html,body').stop().animate({scrollTop: $(".stage").offset().top-100}, 400, function () {
                });
                return;
            }else{
                angular.element($("form[name='investorValidateForm']")).scope()["investorValidateForm"].$setValidity("stageEmpty",true);
            }
            if(!$scope.areaList.length){
                angular.element($("form[name='investorValidateForm']")).scope()["investorValidateForm"].$setValidity("industyEmpty",false);
                $('html,body').stop().animate({scrollTop: $(".stage").offset().top-100}, 400, function () {
                });
                return;
            }else{
                angular.element($("form[name='investorValidateForm']")).scope()["investorValidateForm"].$setValidity("industyEmpty",true);
            }
            $scope.hasClick = true;
            $scope.user.focusIndustry = $scope.areaList;
            $scope.user.businessCardUrl = $scope.intro.value.pictures;
            if($scope.basic.value){
                $scope.user.city = $scope.basic.value.address2;
                $scope.user.country = $scope.basic.value.address1;
            }
            UserService.save({
                id:'identity',
                sub: 'cert',
                subid: 'coinvestor'
            },$scope.user,function(data){
                console.log(data);
                $scope.valStatus = "validating";
                /**
                 * 金蛋理财活动
                 *
                 * @condition: $stateParams.type == 'goldEgg'
                 */
                if ($stateParams.type == 'goldEgg') {
                    krtracker("trackPageView", '金蛋理财活动', "来源：" + $stateParams.source + " | 操作：" + "提交跟投人认证申请");

                    $modal.open({
                        templateUrl: 'templates/syndicates/pop-gold-egg.html',
                        windowClass: 'gold-egg-modal',
                        controller: [
                            '$scope', '$modalInstance', 'scope', 'UserService', 'CrowdFundingService', '$stateParams',
                            function ($scope, $modalInstance, scope, UserService, CrowdFundingService, $stateParams) {
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
                                $scope.isCoInvestor = true;
                                $scope.showForm = false;
                                $scope.isValidateAction = true;
                                $scope.showFormAction = function() {
                                    $scope.showForm = true;
                                    krtracker('trackEvent', '金蛋理财活动', "来源：" + $stateParams.source + " | 操作：" + "点击弹框 - 进行奖品领取");
                                };
                                // 获取用户是否完善资料
                                UserService.isProfileValid(function(data) {
                                    $scope.isProfileValided = data;
                                });
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
                                                $scope.nextText = '立马登录金蛋理财App查看吧！';
                                                krtracker('trackEvent', '金蛋理财活动', "来源：" + $stateParams.source + " | 操作：" + "获得奖励 - 2万元金蛋理财特权本金");
                                                break;
                                            case 2:
                                                $scope.welcomeText = '恭喜您：';
                                                $scope.prizeTitle = '领取3000元金蛋理财特权本金';
                                                $scope.nextText = '立马登录金蛋理财App查看吧！';
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
                                        document.cookie = 'goldEggClear=clear; expires=' + expires.toGMTString();
                                    }, function(err) {
                                        ErrorService.alert(err);
                                    });
                                };
                                // 关闭弹框操作
                                $scope.cancel = function() {
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
                }
            },function(err){
                if(err.code == 1001){
                    $scope.valStatus = "fail";
                }else if(err.code == 1002){
                    $scope.valStatus = "validating";
                }
                ErrorService.alert(err);
                $scope.hasClick = false;
            });
        };
    }
);
