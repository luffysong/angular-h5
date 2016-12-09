/**
 * Controller Name: SearchController
 */

// jscs:disable  requireCamelCaseOrUpperCaseIdentifiers
var angular = require('angular');

angular.module('defaultApp.controller').controller('InvestorValidateApplyController',

    function (OrganizationService, CompanyService, $state, $scope, $rootScope, $stateParams, SuggestService, $q, SearchService,
        DictionaryService, ErrorService, DefaultService, $upload, checkForm, LoginService,
        $timeout, UserService, $location, InvestorauditService, monthOptions, yearOptions, AndroidUploadService,
        PopCaptcha) {

        $scope.positionSuggestObj = {};
        $scope.validate = {
            step: 1
        };
        $scope.params = {};
        $scope.currentIndex = 0;

        $scope.selectItem = function (index) {
            angular.forEach($scope.suggestInvestor, function (item, i) {
                if (~~index === ~~i) {
                    item.active = !item.active;
                } else {
                    item.active = false;
                }
            });

            $scope.getField();
        };

        $scope.getField = function () {
            angular.forEach($scope.suggestInvestor, function (item, index) {
                if (item.active) {
                    $scope.params.relatedId = angular.copy($scope.suggestInvestor[index].id);
                    $scope.params.relatedEntityName = angular.copy($scope.suggestInvestor[index].orgName);
                    $scope.params.relatedName = angular.copy($scope.suggestInvestor[index].name);
                    $scope.params.relatedPosition = angular.copy($scope.suggestInvestor[index].position);
                    $scope.params.singleInvestMin = angular.copy($scope.suggestInvestor[index].singleInvestMin);
                    $scope.params.singleInvestMax = angular.copy($scope.suggestInvestor[index].singleInvestMax);
                    $scope.params.singleInvestUnit = $scope.suggestInvestor[index].singleInvestUnit ? angular.copy($scope.suggestInvestor[index].singleInvestUnit) : 'CNY';
                }
            });
        };

        $scope.getSuggestInvestor = function () {
            var params = $scope.invest && $scope.invest.investorRole === 'COM_ORG' ? {
                name: $scope.user.name
            } : {
                name: $scope.user.name,
                orgName: $scope.organization.addForm.name
            };

            InvestorauditService.suggestInvestor(params, function (data) {
                $scope.suggestInvestor = data;
                console.log(data);
            });
        };

        $scope.organization = {
            addForm: {

            }
        };
        $scope.investorValidateApply = {};
        function initUser() {
            $scope.errorGroup = UserService.errorGroup;
            $scope.user = {
                id: UserService.getUID(),
            };

            /*投资人认证申请*/
            var invest = localStorage && JSON.parse(localStorage.getItem('invest')) || {};

            $scope.invest =  invest.id === UserService.getUID() ? invest : {
                id:'',/*用户id*/
                name:'',/*真实姓名*/
                intro:'',/*一句话简介*/
                investorRole:'',/*投资身份*/
                businessCard:'',/*名片*/
                fundsPhases:'',/*投资阶段*/
                investorFocusIndustrys:'',/*关注领域*/
                mainCurrency:'',/*主投币种 CNY:人民币 USD:美元*/
                businessCardLink:'',/*名片*/
            };
            /*关注领域*/
            $scope.invest.investorFocusIndustrys = DictionaryService.getDict('InvestorFollowedIndustry');
            $scope.invest.fundsPhase = DictionaryService.getDict('FundsPhase');
            /*获取用户默认的关注领域和投资阶段的数据*/

            UserService.basic.get({
                id: $scope.user.id
            }, function (data) {
                delete data.$promise;
                delete data.$resolved;

                angular.extend($scope.user, angular.copy(data));

                if (data.phone) {
                    $scope.user.hasPhone = true;
                    delete $scope.user.phone;
                }

                if (data.email) {
                    $scope.user.hasEmail = true;
                    delete $scope.user.email;
                }

                /*基本信息*/
                $scope.invest.name = data.name;
                $scope.invest.intro = data.intro;
                $scope.invest.industry = data.industry;
                $scope.invest.investPhases = data.investPhases;
                $scope.invest.mainCurrency = data.investorSettings.mainInvestCurrency;

            }, function (err) {

                ErrorService.alert(err);
            });

            var checkTimeout;
            $scope.$watch('user.phone', function (phone) {
                if (!phone || $scope.guideForm.phone.$error.pattern) {
                    return;
                }

                $scope.guideForm.phone.$setValidity('checked', true);
                checkTimeout && $timeout.cancel(checkTimeout);
                checkTimeout = $timeout(function () {
                    $scope.guideForm.phone.$setDirty();
                    UserService.check.get({
                        id: $scope.user.id,
                        phone: phone
                    }, function () {
                    }, function () {

                        $scope.guideForm.phone.$setValidity('checked', false);
                    });
                }, 800);

            });

            $scope.$watch('user.email', function (email) {
                if (!email || $scope.guideForm.email.$error.email) {
                    return;
                }

                $scope.guideForm.email.$setValidity('checked', true);
                checkTimeout && $timeout.cancel(checkTimeout);
                checkTimeout = $timeout(function () {
                    $scope.guideForm.email.$setDirty();
                    UserService.check.get({
                        id: $scope.user.id,
                        email: email
                    }, function () {
                    }, function () {

                        $scope.guideForm.email.$setValidity('checked', false);
                    });
                }, 800);
            });

            $scope.getCode = function (e, voice) {
                e && e.preventDefault();
                if (!$scope.user.phone || $scope.guideForm.phone.$invalid || $scope.wait) {
                    return;
                }

                PopCaptcha.show($scope.getPhoneWithCountryCode(), voice) .result
                    .then(function geestestCb(geesData) {
                        $scope.wait = 30;
                        var interval = setInterval(function () {
                            $scope.$apply(function () {
                                $scope.wait--;
                                if ($scope.wait === 0) {
                                    clearInterval(interval);
                                    $scope.wait = 0;
                                }
                            });
                        }, 1000);

                        var sendCodeRequestData = angular.copy(geesData);
                        sendCodeRequestData.phone = $scope.getPhoneWithCountryCode();
                        UserService.gee.sendCode(sendCodeRequestData, null).$promise
                            .then(codeRequestSuccess)
                            .catch(codeRequestFailed);
                    });
            };

            function codeRequestSuccess() {
            }

            function codeRequestFailed() {
                ErrorService.alert({
                     msg:'发送失败!'
                 });
            }

            LoginService.getCountryDict({}, function (data) {
                $scope.countryDict = data;
                $scope.countryDict.forEach(function (item) {
                    if (item.cc === '86' || item.cc === 86) {
                        $scope.user.cc = item;
                    }
                });
            });

            /**
             * 修改国家
             */
            $scope.changeCountry = function (usernameModel) {
                $scope.user.phone = '';
                usernameModel.$setPristine();
            };

            /**
             * 获取要发送的用户名
             */
            $scope.getPhoneWithCountryCode = function () {
                if (!$scope.user.phone) {
                    return;
                }

                if ($scope.user.cc.cc === '86' || $scope.user.cc.cc === 86) {
                    return $scope.user.phone;
                }

                return [$scope.user.cc.cc, $scope.user.phone].join('+');
            };
        }

        initUser();

        /*function initInvestor() {
            $scope.investorErrorGroup = UserService.investorErrorGroup;

            $scope.investorValidateApply = {
                status:''
            };

            /!*查询投资人认证申请状态*!/
            InvestorauditService.getStatus(function (response) {

                //response.status = -1;
                switch (response.state){
                    /!*审核中*!/
                    case 'PENDING':
                        $scope.investorValidateApply.status = 'checking';
                        break;
                    /!*审核通过*!/
                    case 'PASS':
                        $scope.investorValidateApply.status = 'success';
                        break;
                    default:
                        $scope.investorValidateApply.status = 'basic';
                        break;
                }
            }, function (err) {

                if (err.code !== 4031) {
                    ErrorService.alert(err);
                } else {
                    $scope.investorValidateApply.status = 'new';
                }
            });

        }*/

        //initInvestor();

        $timeout(function () {
            window.scroll(0, 0);
        }, 0);

        document.title = '36氪投资人认证申请';
        window.WEIXINSHARE = {
            shareTitle: '36氪投资人认证申请',
            shareDesc: '投资人认证申请',
            shareImg: 'https://pic.36krcnd.com/36kr_new_logo.jpg'
        };
        window.InitWeixin();
        /*错误信息提示*/
        $scope.error = {
            code:0, //0为不显示，非0显示错误信息
            msg:''
        };
        var Error = {
            show:function (msg) {
                $scope.error.msg = msg;
                $scope.error.code = 1;
            },

            hide:function () {
                $scope.error.code = 0;
            }
        };

        //android客户端
        $scope.androidUpload = function (scope, event, type) {
            AndroidUploadService.setClick(function (filename) {
                $scope.$apply(function () {
                    //logdiv(filename);
                    scope.$setValidity('required', true);
                    scope.uploaded = filename;
                });
            }, type)(event);
        };

        $scope.imgFileSelected  = function (scope, files) {
            var upyun = window.kr.upyun;
            if (files[0].size > 5 * 1024 * 1024) {
                scope.$setValidity('size', true);
                return;
            }

            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                scope.uploading = true;
                scope.progress = 0;
                DefaultService.getUpToken({
                    'x-gmkerl-type': 'fix_width', //限定宽度,高度自适应
                    'x-gmkerl-value': '900',      //限定的宽度的值
                    'x-gmkerl-unsharp': true
                }).then(function (data) {
                    $upload.upload({
                        url: upyun.api + '/' + upyun.bucket.name,
                        data: data,
                        file: file,
                        withCredentials: false
                    }).progress(function (evt) {
                        scope.progress = evt.loaded * 100 / evt.total;
                    }).success(function (data) {

                        var reader = new FileReader();

                        var filename = data.url.toLowerCase();
                        if (filename.indexOf('.jpg') !== -1 || (filename.indexOf('.png') !== -1) ||
                            filename.indexOf('.gif') !== -1 || filename.indexOf('.jpeg') !== -1) {

                            scope.uploaded = window.kr.upyun.bucket.url + data.url;
                            reader.readAsDataURL(file);
                            scope.$setValidity('required', true);
                        } else {
                            scope.$setValidity('type', false);
                        }

                        scope.uploading = false;
                    }).error(function () {
                        scope.$setValidity('type', false);
                        scope.uploading = false;
                    });
                }, function (err) {

                    scope.uploading = false;
                    ErrorService.alert(err);
                });
            }
        };

        $scope.suggestOrganizationObj = {};
        $scope.suggestOrganizationOption = {
            on_leaveSelect: function (val) {
                $scope.organization.isAdd = true;
                $scope.organization.addForm.name = val;
                $scope.organization.addForm.id = undefined;
                $scope.organization.addForm.type = undefined;
            },

            on_select: function (selected) {
                $scope.organization.isAdd = false;
                var organization = selected.obj;
                $scope.organization.addForm.name = $scope.params.orgName = organization.name;
                $scope.organization.addForm.id = $scope.params.orgId = organization.id;
                $scope.organization.addForm.type = organization.type;
                $scope.params.orgType = organization.entityType;
            }
        };

        // 上传logo start
        $scope.logo = {};

        //投资人认证表单
        $scope.intro = {};

        $scope.hasClick = false;

        $scope.nextStep = function () {
            Error.hide();
            if ($scope.guideForm.avatar.uploaded || $scope.user.avatar) {
                $scope.guideForm.avatar.$setValidity('required', true);

                //logdiv($scope.guideForm.avatar.uploaded + '<br/>' + $scope.user.avatar);
            } else {
                $scope.guideForm.avatar.$setValidity('required', false);
            }

            /*检查表单填写是否正确*/
            if ($scope.investorValidateApply.status === 'new' && !checkForm('guideForm')) {
                return false;
            }

            if (!checkForm('investorValidateForm') || $scope.hasClick) {
                return false;
            }

            $scope.validate.step = 2;
            $scope.getSuggestInvestor();

        };
        /*表单提交*/
        $scope.submitForm = function () {
            if (!checkForm('investorValidateForm') || $scope.hasClick) {
                return false;
            }

            if ($scope.investorValidateForm.pictures.uploaded || $scope.invest.pictures) {
                $scope.investorValidateForm.pictures.$setValidity('required', true);
            } else {
                $scope.investorValidateForm.pictures.$setValidity('required', false);
                return false;
            }

            /*名片*/

            window.localStorage && localStorage.setItem('invest', JSON.stringify($scope.invest));

            $scope.hasClick = true;

            if ($scope.investorValidateApply.status === 'new') {
                UserService.basic.update({
                    id: $scope.user.id
                }, {
                    avatar: $scope.guideForm.avatar.uploaded || $scope.user.avatar,
                    name: $scope.user.name,
                    email: $scope.user.email,
                    phone: $scope.getPhoneWithCountryCode(),
                    smscode: $scope.user.smscode
                }).$promise.then(send)
                .catch(function (err) {
                    $scope.hasClick = false;
                    ErrorService.alert({
                        msg: err.msg
                    });
                });
            } else {
                UserService.basic.update({
                    id: $scope.user.id
                }, {
                    avatar: $scope.guideForm.avatar.uploaded || $scope.user.avatar,
                    name: $scope.user.name,
                }).$promise.then(send)
                    .catch(function (err) {
                        $scope.hasClick = false;
                        ErrorService.alert({
                            msg: err.msg
                        });
                    });
            }
        };

        //发送投资人认证数据
        function send() {
            var businessCardLink   = $scope.invest.pictures || $scope.investorValidateForm.pictures.uploaded;
            $scope.params.avatar = $scope.guideForm.avatar.uploaded || $scope.user.avatar;
            $scope.params.realName = $scope.user.name;
            $scope.params.businessCard = businessCardLink;
            $scope.params.investorRoleEnum = $scope.invest.investorRole;
            if ($scope.getPhoneWithCountryCode()) {
                $scope.params.phone = $scope.getPhoneWithCountryCode();
            }

            if ($scope.invest.investorRole === 'COM_ORG') {
                $scope.params.position = $scope.positionSuggestObj.word;
            }

            InvestorauditService.submit($scope.params).then(function () {
                try {
                    window.webkit.messageHandlers.investor.postMessage();
                    return;
                } catch (e) {}

                $scope.investorValidateApply.status = 'checking';
            }, function (err) {

                $scope.hasClick = false;
                ErrorService.alert(err);
            });
        }

        /*function getInvestorTypeNumber(type) {
            var INVESTOR_TYPE_META = {
                PERSONAL_INVESTOR: 1
            };
            if (type === 'PERSONAL_INVESTOR') {
                return INVESTOR_TYPE_META[type];
            } else {
                return $scope.organization.addForm.type;
            }
        }*/
    }
);
