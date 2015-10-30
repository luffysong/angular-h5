/**
 * Controller Name: SearchController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('InvestorValidateController',
    function($scope,DictionaryService,ErrorService,checkForm,$timeout,UserService,$modal, $stateParams,$state,CrowdFundingService,loading) {
        document.title="36氪股权投资";
        loading.show("investorVal");
        $timeout(function(){
            window.scroll(0,0);
        },0);
        /*先判断用户是否完善资料*/
        UserService.isProfileValid(function (valid) {
            if(!valid){
                $state.go('guide.welcome', {
                    type: "investorValidate"
                });
                return;
            }
        });
        /*本周六（0919）20点至本周日（0920）8点跟投人验证功能暂时关闭*/
        var fromDate = new Date(2015,8,19,20,00,00);
        var toDate = new Date(2015,8,20,8,00,00);
        if(new Date() > fromDate && new Date() < toDate){
            $scope.nowClose = true;
        }
        $scope.userId = UserService.getUID();
        $scope.user = {
            investMoneyUnit:"CNY",
            rnv_investor_info:"V1_1",
            id_card_number: "",
            reIdCardNumber:"",
            identity_card_type:"IDCARD",
            investPhases:[],
            passport_number:"",
            passport_url:"",
            intro:"",
            industry:[],
            investMoneyBegin:"",
            investMoneyEnd:"",
            is_completed:0
        };
        $scope.user_cache = angular.copy($scope.user);

        UserService.basic.get({
            id: $scope.userId
        }, function (data){
            // console.log(data);
            $scope.user.intro = $scope.user_cache.intro = data.intro;
            $scope.user.industry = $scope.user_cache.industry = data.industry;
            $scope.user.investPhases = $scope.user_cache.investPhases = data.investPhases;
            $scope.user.investMoneyUnit = $scope.user_cache.investMoneyUnit = data.mainInvestCurrency || $scope.user.investMoneyUnit;
            $scope.user.investMoneyBegin = $scope.user_cache.investMoneyBegin = data.mainInvestCurrency == 'USD' ? data.investorSettings.usdInvestMin :  data.investorSettings.cnyInvestMin;
            $scope.user.investMoneyEnd = $scope.user_cache.investMoneyEnd = data.mainInvestCurrency == 'USD' ? data.investorSettings.usdInvestMax:  data.investorSettings.cnyInvestMax;
            if (data.intro && data.industry.length && data.investPhases.length && $scope.user.investMoneyBegin && $scope.user.investMoneyEnd) {
                $scope.user_cache.is_completed = 1;
            }
        }, function(error){
            // console.log(error);
        });

        $scope.basic = {
            value:{}
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
        CrowdFundingService["audit"].get({
            id:"co-investor",
            submodel:"info"
        },function(data){
            delete data.name;
            if(data.cert_info){
                $scope.user.reIdCardNumber = data.cert_info.id_card_number;
                $scope.basic.value.address1 = data.cert_info.country;
                $scope.basic.value.address2 = data.cert_info.city;
            }
            angular.extend($scope.user,data.cert_info);
            loading.hide("investorVal");
        },function(err){
            if(err.code == 1001){
                $scope.valStatus = "fail";
            }else if(err.code == 1002){
                $scope.valStatus = "validating";
            }else if(err.code == 1003){
                $scope.valStatus = "withoutVal";
            }
            loading.hide("investorVal");
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
        /* 选择个人投资阶段 */
        $scope.selectStage = function(index, name_form){
            name_form = name_form != undefined ? name_form : 'investorValidateForm';
            angular.element($("form[name='" + name_form + "']")).scope()[name_form].$setValidity("stageEmpty",true);
            $scope.investStage[index].active = !$scope.investStage[index].active;

            $scope.user.investPhases = [];
            angular.forEach($scope.investStage,function(key,index){
                if(key.active && $scope.user.investPhases.indexOf(key.value) < 0){
                    $scope.user.investPhases.push(key.value);
                }
            });
        }
        /* 选择关注领域 */
        $scope.selectArea = function(index, name_form){
            name_form = name_form != undefined ? name_form : 'investorValidateForm';
            if($scope.areaList != undefined && $scope.areaList.length == 3 && $scope.areaList.indexOf($scope.fieldsOptions[index].value) < 0){
                return;
            }

            $scope.areaList = [];
            $scope.fieldsOptions[index].active = !$scope.fieldsOptions[index].active;
            angular.forEach($scope.fieldsOptions,function(obj,i){
                if(obj.active && $scope.areaList.indexOf($scope.fieldsOptions[i].value) < 0){
                    $scope.areaList.push($scope.fieldsOptions[i].value);
                }
            });

            if($scope.areaList.length) {
                angular.element($("form[name='" + name_form + "']")).scope()[name_form].$setValidity("industyEmpty",true);
            }
            $scope.user.industry = $scope.areaList;
        }
        /*确认身份证号失去焦点事件*/
        $scope.enterId = function(){
            if(!$scope.user.reIdCardNumber)return;
            $scope.enterCard = true;
        }


        //android客户端
        /*$scope.androidUpload = AndroidUploadService.setClick(function(filename){
            $scope.$apply(function(){
                $scope.intro.value.pictures = filename;
            })

        });*/

        /*上传名片*/
        /*$scope.imgFileSelected  = function(files, e){
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
        };*/
        $timeout(function(){
            $scope.$watch("[user.reIdCardNumber,user.id_card_number]",function(from){
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
        /*表单提交-跟投人信息*/
        $scope.submitForm = function(){
            $scope.enterCard = true;
            /*/!*初始化*!/
            $scope.user.investPhases = [];
            angular.forEach($scope.investStage,function(key,index){
                if(key.active && $scope.user.investPhases.indexOf(key.value) < 0){
                    $scope.user.investPhases.push(key.value);
                }
            });*/
            if(!checkForm("investorValidateForm"))return;
            /*if(!$scope.user.investPhases.length){
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
            }*/
            $scope.hasClick = true;
            if($scope.basic.value){
                $scope.user.city = $scope.basic.value.address2;
                $scope.user.country = $scope.basic.value.address1;
            }
            CrowdFundingService["audit"].save({
                id:'co-investor',
                submodel:'identity-cert'
            },$scope.user,function(data){
                $scope.valStatus = "validating";
                /**
                 * 金蛋理财活动
                 *
                 * @condition: $stateParams.type == 'goldEgg'
                 */
                /*
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
                }
                */
            },function(err){
                if(err.code == 1001){
                    $scope.valStatus = "fail";
                }else if(err.code == 1002){
                    $scope.valStatus = "validating";
                }else {
                    ErrorService.alert(err);
                }
                $scope.hasClick = false;
            });
        };

        $scope.submitFormUser = function(){
            // console.log($scope);
            // console.log($scope.user);
            // console.log($scope.userId);
            $scope.enterCard =true;
            // if(!checkForm("userValidateForm"))return;
            $scope.hasClick = true;

            var param = {};
            param['intro'] = $scope.user.intro;
            param['industry'] = $scope.user.industry.join(',');
            param['investPhases'] = $scope.user.investPhases.join(',');
            param['mainInvestCurrency'] = $scope.user.investMoneyUnit;
            param['cnyInvestMin'] = $scope.user.investMoneyBegin;
            param['cnyInvestMax'] = $scope.user.investMoneyEnd;

            UserService.basic.update({
                id: $scope.userId
            },param ,function(result){
                console.log(result);
                $scope.user_cache.is_completed = 1;
            }, function(error){
                console.log(error);
                $scope.hasClick = false;
            });
        };

        WEIXINSHARE = {
            shareTitle: "36氪股权投资",
            shareDesc: "成为跟投人",
            shareImg: 'http://krplus-pic.b0.upaiyun.com/36kr_new_logo.jpg'
        };
        InitWeixin();
    }
);
