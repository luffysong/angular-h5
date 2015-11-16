/**
 * Controller Name: syndicatesValidateController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesValidateController',
    function($scope, $rootScope, $state, $stateParams, $modal, $upload, notify, $timeout, loading, UserService, checkForm, AndroidUploadService, ErrorService, DefaultService, DictionaryService, CoInvestorService) {
        document.title = '36氪股权投资';

        $timeout(function(){
            window.scroll(0,0);
            loading.show('syndicatesValidate');
        }, 0);

        $timeout(function() {
            loading.hide('syndicatesValidate');
        }, 500);

        $scope.uid = UserService.getUID();
        $scope.isLogin = !!$scope.uid;

        $scope.action = {
            uploaded: false
        };

        $scope.investor = {
            'name': '',
            'avatar': '',
            'id': '',
            'id-confirm': '',
            'email': '',
            'phone': '',
            'captcha': '',
            'company': '',
            'work': '',
            'address': {
                'address1': '',
                'address2': ''
            },
            'condition': ''
        };

        // 获取用户信息
        UserService.basic.get({
            id: $scope.uid
        }, function(data){
            delete data.$promise;
            delete data.$resolved;
            if(data.phone){
                $scope.investor.hasPhone = true;
                delete $scope.investor.phone;
            }
            if(data.email && data.isEmailActivate){
                $scope.investor.hasEmail = true;
                delete $scope.investor.email;
            }
            $scope.investor.name = data.name;
            $scope.investor.avatar = data.avatar;
        });

        // 头像上传
        $scope.androidUpload = AndroidUploadService.setClick(function(file) {
            $scope.$apply(function() {
                $scope.investor.avatar = file;
            });
        });

        $scope.imgFileSelected  = function(files, e) {
            e.preventDefault();

            var upyun = window.kr.upyun;

            if(files[0].size > 5 * 1024 * 1024){
                ErrorService.alert({
                    msg:'附件大于5M'
                });
                return;
            }

            for(var i = 0; i < files.length; i++) {
                var file = files[i];
                $scope.action.uploading = true;
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
                        console.log(parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function (data, status, headers, config) {
                        var filename = data.url.toLowerCase();
                        if(filename.indexOf('.jpg') != -1 || (filename.indexOf('.png') != -1) || filename.indexOf('.gif') != -1) {
                            $scope.investor.avatar = upyun.bucket.url + data.url;
                            $scope.action.uploaded = true;
                        } else {
                            ErrorService.alert({
                                msg: '格式不支持，请重新上传！'
                            });
                        }
                        $scope.action.uploading = false;
                    }).error(function(){
                        ErrorService.alert({
                            msg: '格式不支持，请重新上传！'
                        });
                        $scope.action.uploading = false;
                    });
                }, function (err) {
                    ErrorService.alert(err);
                    $scope.action.uploading = false;
                });
            }
        };

        // 邮箱校验
        var checkTimeout;
        $scope.$watch('investor.email', function(email) {
            if(!email || $scope.syndicatesValidateForm['investor-email'].$error.email) {
                return;
            }
            $scope.syndicatesValidateForm['investor-email'].$setValidity('checked', true);
            checkTimeout && $timeout.cancel(checkTimeout);
            checkTimeout = $timeout(function() {
                $scope.syndicatesValidateForm['investor-email'].$setDirty();
                UserService.check.get({
                    id: $scope.uid,
                    email: email
                }, function(data) {

                }, function() {
                    $scope.syndicatesValidateForm['investor-email'].$setValidity('checked', false);
                });
            }, 800);
        });

        // 手机验证
        $scope.$watch('investor.phone', function(phone) {
            if(!phone || !$rootScope.REGEXP.phone.test(phone)){
                return;
            }
            $scope.syndicatesValidateForm['investor-phone'].$setValidity("checked", true);
            checkTimeout && $timeout.cancel(checkTimeout);
            checkTimeout = $timeout(function(){
                $scope.syndicatesValidateForm['investor-phone'].$setDirty();
                UserService.check.get({
                    id: $scope.uid,
                    phone: phone
                }, function(data) {

                }, function() {
                    $scope.syndicatesValidateForm['investor-phone'].$setValidity("checked", false);
                });
            }, 800);
        });

        // 获取验证码
        $scope.getCode = function(e){
            e.preventDefault();
            if(!$scope.investor.phone) {
                return;
            }
            if($scope.wait) {
                return;
            }
            $scope.wait = 60;
            var interval = setInterval(function() {
                $scope.$apply(function() {
                    $scope.wait--;
                    if($scope.wait == 0){
                        $scope.wait = 0;
                        clearInterval(interval);
                    }
                })
            }, 1000);
            UserService['send-sms'].send({
                id: $scope.uid
            }, {
                phone: $scope.investor.phone
            }, function(data) {
            }, function(){
                 ErrorService.alert({
                     msg:'发送失败!'
                 });
            });
        };

        // 身份证验证
        $timeout(function(){
            $scope.$watch("[investor['id-confirm'], investor.id]",function(from){
                if(angular.element($("form[name='syndicatesValidateForm']")).length > 0) {
                    if(from[0] != from[1]) {
                        angular.element($("form[name='syndicatesValidateForm']")).scope()["syndicatesValidateForm"].$setValidity("idcardInvalid", false);
                    } else {
                        angular.element($("form[name='syndicatesValidateForm']")).scope()["syndicatesValidateForm"].$setValidity("idcardInvalid", true);
                    }
                }
            });
        }, 500);

        $scope.enterId = function(){
            if(!$scope.investor['id-confirm']) return;
            $scope.enterCard = true;
        };

        // 选择所在地
        $scope.addr1Options = DictionaryService.getLocation();
        $scope.addr2Options = [];
        $scope.addr1Change = function() {
            if ($scope.investor.address) {
                $scope.investor.address.address1 = '';
                $scope.investor.address.address2 = '';
            }
        };

        $scope.$watch('investor.address.address1', function(value) {
            console.log(value);
            $scope.addr2Options = [];
            if (!value) {
                return;
            }
            $scope.addr2Options = DictionaryService.getLocation(value);
        });

        // 选择个人投资阶段
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
        };

        $scope.submitForm = function() {
            $scope.enterCard = true;
            if(!checkForm('syndicatesValidateForm')) return;
        };

        // 查看风险揭示书
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
        };

        // 查看用户服务协议
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
        };
    });
