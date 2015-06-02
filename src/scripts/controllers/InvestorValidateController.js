/**
 * Controller Name: SearchController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('InvestorValidateController',
    function($scope, SearchService,DictionaryService,ErrorService,DefaultService,$upload,checkForm,$timeout,UserService) {
        $scope.stageList = [];
        $scope.areaList = [];
        $scope.user = {
            investMoneyUnit:"CNY",
            identityCardType:"IDCARD"
        };
        $scope.intro = {};
        $scope.basic = {};
        $scope.intro.value = {
            intro:"",
            pictures:""
        };
        $scope.valStatus = "validating";
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
        $scope.tempList = $scope.fieldsOptions.concat();
        $scope.fieldsOptions = $scope.fieldsOptions.slice(0,8);
        /*选择所在地事件*/
        $scope.addr1Change = function() {
            if ($scope.basic.value) {
                $scope.basic.value.address2 = "";
            }
        };
        $scope.$watch('basic.value.address1', function(value) {
            $scope.addr2Options = [];
            $scope.addr3Options = [];
            if (!value) {
                return;
            }
            $scope.addr2Options = DictionaryService.getLocation(value);
        });

        $scope.selectStage = function(index){
            angular.element($("form[name='investorValidateForm']")).scope()["investorValidateForm"].$setValidity("stageEmpty",true);
            angular.forEach($scope.investStage,function(obj){
                obj.active = false;
            });
            $scope.stageList = [];
            $scope.investStage[index].active = true;
            $scope.stageList.push($scope.investStage[index]);
        }
        $scope.selectArea = function(index){
            if($scope.areaList.length >= 3){
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
        /*点击更多加载关注领域*/
        $scope.loadArea = function(){
            $scope.noMore = true;
            $scope.fieldsOptions = $scope.tempList;
        }
        /*确认身份证号失去焦点事件*/
        $scope.enterId = function(){
            if(!$scope.user.reIdCardNumber)return;
            $scope.enterCard = true;
        }
        /*上传名片*/
        $scope.imgFileSelected  = function(files, e){
            var upyun = window.kr.upyun;
            if(files[0].size > 2 * 1024 * 1024){
                ErrorService.alert({
                    msg:"附件大于2M"
                });
                return;
            }
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
                        if(filename.indexOf('.jpg') != -1 || (filename.indexOf('.png') != -1) || filename.indexOf('.gif') != -1) {
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
            angular.forEach($scope.investStage,function(key,index){
                $scope.user[key.engName] = key.active;
            });
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
                console.log(err);
                if(err.code == 1001){
                    $scope.valStatus = "fail";
                }else if(err.code == 1002){
                    $scope.valStatus = "validating";
                }
                ErrorService.alert(err);
            });
        };
    }
);
