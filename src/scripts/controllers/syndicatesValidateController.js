/**
 * Controller Name: syndicatesValidateController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesValidateController',
    function($scope, $rootScope, $state, $stateParams, $modal, $upload, notify, $timeout, loading, UserService, checkForm, AndroidUploadService, ErrorService, DefaultService, DictionaryService, CrowdFundingService, CoInvestorService) {
        document.title = '富豪养成计划';
        $scope.$on('$locationChangeStart', function() {
            document.title = '36氪股权融资';
        });

        CommonHeader.setNavActive('zhong');

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
            'condition': 'V1_1',
            'uid_inviter': $stateParams.inviter_id
        };

        // 获取用户信息
        UserService.basic.get({
            id: $scope.uid
        }, function(data){
            delete data.$promise;
            delete data.$resolved;

            console.log(data);

            if(data.phone){
                $scope.investor.hasPhone = true;
                delete $scope.investor.phone;
            }
            if(data.email){
                $scope.investor.hasEmail = true;
                delete $scope.investor.email;
            }
            $scope.investor.name = data.name;
            $scope.investor.avatar = data.avatar;
        }, function(err) {
            ErrorService.alert(err);
        });

        // 跟投人认证信息
        CrowdFundingService["audit"].get({
            id:"co-investor",
            submodel:"info"
        }, function(data) {
            if(data.cert_info){
                $scope.investor.id = data.cert_info.id_card_number;
                $scope.investor['id-confirm'] = data.cert_info.id_card_number;
                $scope.investor.company = data.cert_info.company_name;
                $scope.investor.work = data.cert_info.position_name;
                $scope.investor.address.address1 = data.cert_info.country;
                $scope.investor.address.address2 = data.cert_info.city;
            }
        }, function(err) {
            console.log(err);
        });

        // 头像上传
        $scope.androidUpload = AndroidUploadService.setClick(function(file) {
            $scope.$apply(function() {
                $scope.investor.avatar = file;
            });
        });

        $scope.imgFileSelected  = function(files, e) {
            e && e.preventDefault();

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
                        alert(filename);
                        if(filename.indexOf('.jpeg') != -1 || filename.indexOf('.jpg') != -1 || (filename.indexOf('.png') != -1) || filename.indexOf('.gif') != -1) {
                            $scope.investor.avatar = upyun.bucket.url + data.url;
                            $scope.action.uploaded = true;
                        } else {
                            ErrorService.alert({
                                msg: '格式不支持，请重新上传！'
                            });
                        }
                        $scope.action.uploading = false;
                    }).error(function(err){
                        ErrorService.alert({
                            msg: '上传过程中出现错误，请重新上传！'
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
            e && e.preventDefault();
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
                $scope.investor.address.address2 = '';
            }
        };

        $scope.$watch('investor.address.address1', function(value) {
            $scope.addr2Options = [];
            if (!value) {
                return;
            }
            $scope.addr2Options = DictionaryService.getLocation(value);
        });

        // 投资阶段
        $scope.condition = DictionaryService.getDict("RnvInvestorInfo");

        // 提交表单
        $scope.hasClick = false;
        $scope.submitForm = function(e) {
            e && e.preventDefault();
            $scope.enterCard = true;
            if(!checkForm('syndicatesValidateForm')) return;

            if(!$scope.investor.avatar) {
                $('<div class="error-alert error error-code">请上传真实头像</div>').appendTo('body');
                $timeout(function() {
                    $('.error-code').fadeOut();
                }, 2000);
                return;
            }

            $scope.hasClick = true;

            UserService.basic.update({
                id: $scope.uid
            }, {
                avatar: $scope.investor.avatar,
                name: $scope.investor.name,
                email: $scope.investor.email,
                phone: $scope.investor.phone,
                smscode: $scope.investor.captcha
            }, function(data){
                console.log(data);

                CrowdFundingService["audit"].save({
                    id: 'co-investor',
                    submodel: 'identity-cert'
                }, {
                    name: $scope.investor.name,
                    company_name: $scope.investor.company,
                    position_name: $scope.investor.work,
                    identity_card_type: 'IDCARD',
                    id_card_number: $scope.investor.id,
                    city: $scope.investor.address.address2,
                    country: $scope.investor.address.address1,
                    rnv_investor_info: $scope.investor.condition,
                    uid_inviter: $scope.investor.uid_inviter
                }, function(data) {
                    $scope.hasClick = false;
                }, function(err) {
                    if(err.code && err.code == 1002) {
                        $state.go('syndicatesGift', {
                            id: $scope.investor.uid_inviter
                        });
                    } else {
                        ErrorService.alert(err);
                    }
                    $scope.hasClick = false;
                });
            }, function(err){
                $scope.hasClick = false;
                ErrorService.alert(err);
            });
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
