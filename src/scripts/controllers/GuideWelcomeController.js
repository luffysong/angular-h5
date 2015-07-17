/**
 * Controller Name: GuideWelcomeController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('GuideWelcomeController',
    function($stateParams, $scope, UserService, DefaultService, $state, checkForm, ErrorService, $rootScope, $timeout, $upload, AndroidUploadService) {
        console.log($stateParams, 'welcome')
        $scope.sourceType = $stateParams.type || 'other';

        $scope.user = {
            avatar:""
        };

        $scope.userId = UserService.getUID();

        UserService.basic.get({
            id: $scope.userId
        }, function(data){
            delete data.$promise;
            delete data.$resolved;
            //data.avatar = ""
            angular.extend($scope.user, angular.copy(data));
            if(data.email && data.phone && data.avatar && data.name){
                $state.go('investorValidate');
            }
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
                $('<div class="error-alert error error-sms">发送失败</div>').appendTo('body');
                $timeout(function(){
                    $('.error-sms').fadeOut();
                },2000);
                // ErrorService.alert({
                //     msg:'发送失败!'
                // });
            });
        }

        // 头像上传
        $scope.intro = {};
        $scope.intro.value = {
            intro:"",
            pictures:""
        };

        //android客户端
        $scope.androidUpload = AndroidUploadService.setClick(function(filename){
                $scope.$apply(function() {
                    $scope.user.avatar = filename;
                });
        });

        $scope.imgFileSelected  = function(files, e){
            var upyun = window.kr.upyun;
            if(files[0].size > 5 * 1024 * 1024){
                $('<div class="error-alert error error-avatar">附件大于5M</div>').appendTo('body');
                $timeout(function(){
                    $('.error-avatar').fadeOut();
                },2000);
                // ErrorService.alert({
                //     msg:"附件大于5M"
                // });
                return;
            }
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $scope.intro.uploading = true;
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

                    }).success(function (data, status, headers, config) {
                        var filename = data.url.toLowerCase();
                        if(filename.indexOf('.jpg') != -1 || (filename.indexOf('.png') != -1) || filename.indexOf('.gif') != -1) {
                            $scope.user.avatar = window.kr.upyun.bucket.url + data.url;
                        } else {
                            $('<div class="error-alert error error-photo">格式不支持，请重新上传！</div>').appendTo('body');
                            $timeout(function(){
                                $('.error-photo').fadeOut();
                            },2000);
                            // ErrorService.alert({
                            //     msg: '格式不支持，请重新上传！'
                            // });
                        }
                        $scope.intro.uploading = false;
                    }).error(function(){
                        $('<div class="error-alert error error-pic">格式不支持，请重新上传！</div>').appendTo('body');
                        $timeout(function(){
                            $('.error-pic').fadeOut();
                        },2000);
                        // ErrorService.alert({
                        //     msg: '格式不支持，请重新上传！'
                        // });
                        $scope.intro.uploading = false;
                    });
                }, function (err) {
                    $scope.intro.uploading = false;
                    $('<div class="error-alert error error-msg">' + err.msg + '</div>').appendTo('body');
                    $timeout(function(){
                        $('.error-msg').fadeOut();
                    },2000);
                    // ErrorService.alert(err);
                });
            }
        };

        $scope.submitForm = function(e){
            e && e.preventDefault();
            if(!$scope.user.avatar) {
                $('<div class="error-alert error error-code">请上传真实头像</div>').appendTo('body');
                $timeout(function(){
                    $('.error-code').fadeOut();
                },2000);
                return;
            }

            if(!checkForm('guideForm'))return;
            UserService.basic.update({
                id: $scope.userId
            }, {
                avatar: $scope.user.avatar,
                name: $scope.user.name,
                email: $scope.user.email,
                phone: $scope.user.phone,
                smscode: $scope.user.smscode
            }, function(data){
                if($scope.applySpaceEnter){
                    $state.go('krspace.judge');
                }else if($stateParams.from){
                    // $state.go('guide.success-enter');
                    //$state.go('investorValidate');
                    console.log($stateParams.from)
                    location.href = decodeURIComponent($stateParams.from)
                }
                //setTimeout(function(){
                //    location.reload();
                //},0);
            }, function(err){
                $('<div class="error-alert error error-code">' + err.msg + '</div>').appendTo('body');
                $timeout(function(){
                    $('.error-code').fadeOut();
                },2000);

                // ErrorService.alert(err);
            })
        };

    }
);























