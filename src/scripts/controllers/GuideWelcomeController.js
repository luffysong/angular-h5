/**
 * Controller Name: GuideWelcomeController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('GuideWelcomeController',
    function($scope, UserService, DefaultService, $state, checkForm, ErrorService, $rootScope, $timeout, $upload) {

        // $scope.formData = {
        //     isInvestFirstPhase: false,
        //     isInvestSecondPhase: false,
        //     isInvestThirdPhase: false,
        //     investMoneyUnit:"CNY",
        //     idCardNumber:"",
        //     reIdCardNumber:"",
        //     identityCardType:"IDCARD",
        //     rnvInvestorInfo:"V1_1"
        // };

        $scope.userId = UserService.getUID();
        UserService.basic.get({
            id: $scope.userId
        }, function(data){
            delete data.$promise;
            delete data.$resolved;
            angular.extend($scope.user, angular.copy(data));
            if(data.phone){
                $scope.user.hasPhone = true;
                delete $scope.user.phone;
            }
            if(data.email && data.isEmailActivate){
                $scope.user.hasEmail = true;
                delete $scope.user.email;
            }
        });

        var checkTimeout;
        $scope.$watch('user.phone', function(phone){
            if(!phone || !$rootScope.REGEXP.phone.test(phone)){
                return;
            }
            $scope.guideForm.phone.$setValidity("checked", true);
            checkTimeout && $timeout.cancel(checkTimeout);
            checkTimeout = $timeout(function(){
                $scope.guideForm.phone.$setDirty();
                UserService.check.get({
                    id: $scope.userId,
                    phone: phone
                }, function(data){

                }, function(err){
                    $scope.guideForm.phone.$setValidity("checked", false);
                });
            },800);

        });

        $scope.$watch('user.email', function(email){
            if(!email || $scope.guideForm.email.$error.email){
                return;
            }
            $scope.guideForm.email.$setValidity("checked", true);
            checkTimeout && $timeout.cancel(checkTimeout);
            checkTimeout = $timeout(function(){
            $scope.guideForm.email.$setDirty();
                UserService.check.get({
                    id: $scope.userId,
                    email: email
                }, function(data){

                }, function(err){
                    $scope.guideForm.email.$setValidity("checked", false);
                });
            },800);
        });
        if(window.sessionStorage.applySpaceStatus) {
            $scope.applySpaceEnter = true;
        } else {
            $scope.applySpaceEnter = false;
        }

        $scope.submitForm = function(e){
            e && e.preventDefault();
            if(!checkForm('guideForm'))return;
            UserService.basic.update({
                id: $scope.userId
            }, {
                avatar: $scope.intro.value.pictures,
                name: $scope.user.name,
                email: $scope.user.email,
                phone: $scope.user.phone,
                smscode: $scope.user.smscode
            }, function(data){
                if($scope.applySpaceEnter){
                    $state.go('krspace.judge');
                }else{
                    $state.go('guide.success-enter');
                }
                setTimeout(function(){
                    location.reload();
                },0);
            }, function(err){
                ErrorService.alert(err);
            })
        };



        $scope.getCode = function(e){
            e && e.preventDefault();
            if(!$scope.user.phone){
                return;
            }
            if($scope.wait){
                return;
            }
            $scope.wait = 60;
            var interval = setInterval(function(){
                $scope.$apply(function(){
                    $scope.wait--;
                    if($scope.wait==0){
                        clearInterval(interval);
                        $scope.wait = 0;
                    }
                })
            },1000);
            UserService['send-sms'].send({
                id: $scope.userId
            },{
                phone: $scope.user.phone
            }, function(data){
            }, function(err){
                ErrorService.alert({
                    msg:'发送失败!'
                });
            });
        }

        $scope.passport = {};
        $scope.intro = {};
        $scope.passport.value = {
            intro:"",
            pictures:""
        };
        $scope.intro.value = {
            intro:"",
            pictures:"http://krplus.b0.upaiyun.com/default_avatar.png!70"
        };

        $scope.imgFileSelected  = function(files, e){
            var upyun = window.kr.upyun;
            if(files[0].size > 5 * 1024 * 1024){
                ErrorService.alert({
                    msg:"附件大于5M"
                });
                return;
            }
            if($scope.target == "passport"){
                if($scope.btnText == $scope.text["re-upload"]){
                    $scope.passport.value.pictures = "";
                }
            }else {
                if($scope.passport.btnText == $scope.text["re-upload"]){
                    $scope.intro.value.pictures = "";
                }
            }
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $scope.intro.uploading = true;
                $scope.intro.progress = 0;
                $scope.passport.uploading = true;
                $scope.passport.progress = 0;
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
                        $scope.passport.progress = evt.loaded * 100 / evt.total;
                    }).success(function (data, status, headers, config) {
                        var filename = data.url.toLowerCase();
                        if(filename.indexOf('.jpg') != -1 || (filename.indexOf('.png') != -1) || filename.indexOf('.gif') != -1) {
                            // if($scope.formData.identityCardType == "PASSPORT"){
                                // $scope.passport.value.pictures = window.kr.upyun.bucket.url + data.url;
                            // }else{
                                $scope.intro.value.pictures = window.kr.upyun.bucket.url + data.url;
                            // }
                        } else {
                            ErrorService.alert({
                                msg: '格式不支持，请重新上传！'
                            });
                        }
                        $scope.intro.uploading = false;
                        $scope.passport.uploading = false;
                        $scope.btnText = $scope.text["re-upload"];
                        $scope.passport.btnText = $scope.text["re-upload"];
                    }).error(function(){
                        ErrorService.alert({
                            msg: '格式不支持，请重新上传！'
                        });
                        $scope.intro.uploading = false;
                        $scope.passport.uploading = false;
                    });
                }, function (err) {
                    $scope.intro.uploading = false;
                    ErrorService.alert(err);
                });
            }
        };
        $scope.text = {
            "un-upload":"本地上传",
            "re-upload":"重新上传"
        };
        $scope.btnText = $scope.text["un-upload"];
        $scope.passport.btnText = $scope.text["un-upload"];
        $scope.uploadCard = function(target){
            $scope.target = target;
        }
    }
);























