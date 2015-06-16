/**
 * Controller Name: SearchController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('InvestorValidateController',
    function($scope, SearchService,DictionaryService,ErrorService,DefaultService,$upload,checkForm,$timeout,UserService,$location) {
        if(!UserService.getUID()){
            location.href = "/user/login?from=" + encodeURIComponent(location.href);
            return;
        }
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
            rnvInvestorInfo:"V1_1"
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
        $scope.investStage = [
            {
                name:"早期",
                engName:"isInvestFirstPhase",
                active:false
            },{
                name:"成长期",
                engName:"isInvestSecondPhase",
                active:false
            },{
                name:"成熟期",
                engName:"isInvestThirdPhase",
                active:false
            }
        ];
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
            if(data.industry && data.industry.length){
                angular.extend($scope.areaList,data.industry);
                angular.forEach(data.industry,function(o,i){
                    angular.forEach($scope.fieldsOptions,function(key,index){
                        if(key.value == o){
                            key.active = true;
                        }
                    });
                });
            }
            /*投资阶段数据处理*/
            angular.forEach(data,function(val,key){
                if(key == "isInvestFirstPhase" || key == "isInvestSecondPhase" || key == "isInvestThirdPhase"){
                    if(data[key]){
                        angular.forEach($scope.investStage,function(obj,index){
                            if(obj.engName == key){
                                obj.active = true;
                            }
                        });
                    }
                }
            });
            $scope.basic.value.address1 = data.country;
            $scope.basic.value.address2 = data.city;

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
        }
        /*确认身份证号失去焦点事件*/
        $scope.enterId = function(){
            if(!$scope.user.reIdCardNumber)return;
            $scope.enterCard = true;
        }
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
        /*表单提交*/
        $scope.submitForm = function(){
            angular.forEach($scope.investStage,function(key,index){
                $scope.user[key.engName] = key.active;
                if(key.active){
                    $scope.stageList.push(key);
                }
            });
            if(!$scope.areaList.length){
                angular.element($("form[name='investorValidateForm']")).scope()["investorValidateForm"].$setValidity("industyEmpty",false);
            }else{
                angular.element($("form[name='investorValidateForm']")).scope()["investorValidateForm"].$setValidity("industyEmpty",true);
            }
            if(!$scope.stageList.length){
                angular.element($("form[name='investorValidateForm']")).scope()["investorValidateForm"].$setValidity("stageEmpty",false);
            }else{
                angular.element($("form[name='investorValidateForm']")).scope()["investorValidateForm"].$setValidity("stageEmpty",true);
            }
            if(!checkForm("investorValidateForm"))return;
            $scope.hasClick = true;
            $scope.user.focusIndustry = $scope.areaList;
            $scope.user.businessCardUrl = $scope.intro.value.pictures;
            if($scope.basic.value){
                $scope.user.city = $scope.basic.value.address2;
                $scope.user.country = $scope.basic.value.address1;
            }
            console.log($scope.user);
            UserService.save({
                id:'identity',
                sub: 'cert',
                subid: 'coinvestor'
            },$scope.user,function(data){
                console.log(data);
                $scope.valStatus = "validating";
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
