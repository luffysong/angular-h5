/**
 * Controller Name: InvestorController
 */

// jscs:disable  requireCamelCaseOrUpperCaseIdentifiers
var angular = require('angular');

angular.module('defaultApp.controller').controller('InvestorController',

    function (OrganizationService, CompanyService, $state, $scope, $rootScope, $stateParams, SuggestService, $q, SearchService,
        DictionaryService, ErrorService, DefaultService, $upload, checkForm, LoginService,
        $timeout, UserService, $location, InvestorauditService, monthOptions, yearOptions, AndroidUploadService, FindService) {

        $scope.positionSuggestObj = {};
        $scope.organization = {
            addForm: {

            }
        };
        $scope.investorValidateApply = {};
        $scope.ktm_source = $stateParams.ktm_source;

        checkUser();

        function checkUser() {
            if (!UserService.getUID()) {
                console.log('未登陆');
                $state.go('findLogin', {
                    ktm_source: $scope.ktm_source
                });
            } else {
                getActivity();
            }
        }

        //查看是否参与过活动
        function getActivity() {
            var sendData = {
                activityName:$scope.ktm_source
            };
            FindService.getActivity(sendData)
                .then(function (response) {
                    $scope.hasSubmit = response.data.hasSubmit;
                    if (!$scope.hasSubmit) {
                        initUser();
                        $('html').css('overflow', 'hidden');
                        $('body').css('overflow', 'hidden');
                        window.parent.initCss && window.parent.initCss();
                    } else {
                        $state.go('findInvestorSuccess', {
                            ktm_source: $scope.ktm_source
                        });
                    }
                })
                .catch(error);
        }

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

            FindService.getUserProfile()
                .then(function temp(response) {
                    angular.extend($scope.user, angular.copy(response.data));
                    $scope.responseData = angular.copy(response.data);
                    $scope.invest.name = $scope.responseData.name;

                    //-1:"审核未通过";0:"审核中";1:"审核通过"
                    if ($scope.responseData.auditStatus === 0) {

                        //是否是修改投资身份或机构
                        if ($scope.responseData.auditInvestorRole !== undefined) {
                            $scope.invest.investorRole = $scope.responseData.auditInvestorRole;
                            $scope.suggestOrganizationObj.word = $scope.responseData.auditInvestorEntityName;
                        } else {
                            $scope.invest.investorRole = $scope.responseData.investorRole;
                            $scope.suggestOrganizationObj.word = $scope.responseData.investorEntityName;
                        }
                    } else if ($scope.responseData.auditStatus === 1) {
                        $scope.invest.investorRole = $scope.responseData.investorRole;
                        $scope.suggestOrganizationObj.word = $scope.responseData.investorEntityName;
                    }

                })
                .catch(error);

        }

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
                $scope.suggestOrganizationObj.word = '';
                if (val !== $scope.user.investorEntityName) {
                    $scope.detailHasChange = true;
                }
            },

            on_select: function (selected) {
                $scope.organization.isAdd = false;
                var organization = selected.obj;
                $scope.organization.addForm.name = organization.name;
                $scope.organization.addForm.id = organization.id;
                $scope.organization.addForm.type = organization.type;
                if (organization.name !== $scope.user.investorEntityName) {
                    $scope.detailHasChange = true;
                }
            }
        };

        // 上传logo start
        $scope.logo = {};

        //投资人认证表单
        $scope.intro = {};

        $scope.hasClick = false;
        /*表单提交*/
        $scope.submitForm = function () {

            Error.hide();

            /*检查表单填写是否正确*/
            if ($scope.investorValidateApply.status === 'new' && !checkForm('guideForm')) {
                return false;
            }

            if (!checkForm('investorValidateForm') || $scope.hasClick) {
                return false;
            }

            if ($scope.detailHasChange) {
                if ($scope.investorValidateForm.pictures.uploaded || $scope.invest.pictures) {
                    $scope.investorValidateForm.pictures.$setValidity('required', true);
                } else {
                    $scope.investorValidateForm.pictures.$setValidity('required', false);
                    return false;
                }
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

            $scope.organization.addForm = $scope.organization.addForm;

            if ($scope.user.auditStatus === undefined || $scope.user.auditStatus === -1) {
                var businessCardLink   = $scope.invest.pictures || $scope.investorValidateForm.pictures.uploaded;
                var sendData = {
                    entityType: getInvestorTypeNumber($scope.invest.investorRole),
                    entityId:$scope.organization.addForm.id,
                    entityName:$scope.organization.addForm.name,
                    businessCardLink: businessCardLink
                };

                InvestorauditService.save(sendData).then(function () {
                    try {
                        window.webkit.messageHandlers.investor.postMessage();
                        return;
                    } catch (e) {}

                    setActivity();
                }, function (err) {

                    $scope.hasClick = false;
                    ErrorService.alert(err);
                });
            } else if ($scope.user.auditStatus === 1) {
                var editData = {
                    investorRole: $scope.invest.investorRole,
                    investorEntityName: $scope.organization.addForm.name,
                    investorEntityId: $scope.organization.addForm.id,
                };
                if ($scope.detailHasChange) {
                    var link   = $scope.invest.pictures || $scope.investorValidateForm.pictures.uploaded;
                    editData.businessCardLink = link;
                }

                FindService.editUserProfile(editData)
                    .then(setActivity)
                    .catch(error);
            } else {
                setActivity();
            }
        }

        //提交活动报名
        function setActivity() {
            var sendData = {
                activityName:$scope.ktm_source,
            };
            if ($scope.detailHasChange) {
                var link   = $scope.invest.pictures || $scope.investorValidateForm.pictures.uploaded;
                sendData.bizCard = link;
            }

            FindService.setActivity(sendData)
                .then(function temp() {
                    $state.go('findInvestorSuccess', {
                        ktm_source: $scope.ktm_source
                    });
                })
                .catch(error);
        }

        function getInvestorTypeNumber(type) {
            var INVESTOR_TYPE_META = {
                PERSONAL_INVESTOR: 1
            };
            if (type === 'PERSONAL_INVESTOR') {
                return INVESTOR_TYPE_META[type];
            } else {
                return $scope.organization.addForm.type;
            }
        }

        function error(err) {
            ErrorService.alert(err);
        }
    }
);
