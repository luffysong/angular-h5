/**
 * Controller Name: FrInvestorController
 */

// jscs:disable  requireCamelCaseOrUpperCaseIdentifiers
var angular = require('angular');

angular.module('defaultApp.controller').controller('FrInvestorController',

    function (OrganizationService, CompanyService, $state, $scope, $rootScope, $stateParams, SuggestService, $q, SearchService,
        DictionaryService, ErrorService, DefaultService, $upload, checkForm, LoginService,
        $timeout, UserService, $location, InvestorauditService, monthOptions,
        yearOptions, AndroidUploadService, FindService, ActivityService) {
        var vm = this;
        vm.bothh3 = false;
        vm.investorh3 = false;
        vm.startuph3 = false;

        $scope.positionSuggestObj = {};
        $scope.organization = {
            addForm: {

            }
        };
        $scope.activityName = $stateParams.activityName;

        checkUser();

        function checkUser() {
            // if (window.WEIXINSHARE && window.WEIXINSHARE.shareTitle) {
            //     document.title = window.WEIXINSHARE.shareTitle;
            // }
            getActInfo();
            if (!UserService.getUID()) {
                $state.go('findLogin', {
                    activityName: $scope.activityName
                });
            } else {
                getActivity();
            }
        }

        //查看是否参与过活动
        function getActivity() {
            ActivityService.investorState($scope.activityName)
                .then(function (response) {
                    $scope.hasSubmit = response.data.applied;
                    if (!$scope.hasSubmit) {
                        initUser();
                        $('html').css('overflow', 'hidden');
                        $('body').css('overflow', 'hidden');
                        window.parent.initCss && window.parent.initCss();
                    } else {
                        $state.go('frInvestorSuccess', {
                            activityName: $scope.activityName
                        });
                    }
                })
                .catch(error);
        }

        function getActInfo() {
            ActivityService.actInfo($scope.activityName)
                .then(function (response) {
                    document.applierType = response.data.applierType;
                    initH3();
                })
                .catch(error);
        }

        function initUser() {
            $scope.errorGroup = UserService.errorGroup;
            $scope.investorErrorGroup = UserService.investorErrorGroup;
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
            if (!checkForm('guideForm')) {
                return false;
            }

            if (!checkForm('investorValidateForm') || $scope.hasClick) {
                return false;
            }

            if ($scope.detailHasChange || $scope.user.auditStatus === undefined || $scope.user.auditStatus === -1) {
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
        };

        //发送投资人认证数据
        function send() {

            $scope.organization.addForm = $scope.organization.addForm;

            if ($scope.user.auditStatus === undefined || $scope.user.auditStatus === -1) {
                var businessCardLink   = $scope.invest.pictures || $scope.investorValidateForm.pictures.uploaded;
                var sendData = {
                    entityType: parseInt($scope.invest.investorRole),
                    entityId:$scope.organization.addForm.id,
                    entityName:$scope.organization.addForm.name,
                    businessCardLink: businessCardLink
                };

                var sendD = {
                    investorRoleEnum: getInvestorRole($scope.invest.investorRole),
                    orgId:$scope.organization.addForm.id,
                    orgName:$scope.organization.addForm.name,
                    businessCard: businessCardLink,
                    realName: $scope.user.name,
                };

                // then(function () {
                //     InvestorauditService.save(sendData);
                // }).

                InvestorauditService.submit(sendD).then(function () {
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
                if ($scope.organization.addForm.type) {
                    editData.investorEntityType = $scope.organization.addForm.type;
                }

                if ($scope.detailHasChange) {
                    var link   = $scope.invest.pictures || $scope.investorValidateForm.pictures.uploaded;
                    editData.businessCardLink = link;
                    if ($scope.user.investorRole === $scope.invest.investorRole && $scope.user.investorEntityId === $scope.organization.addForm.id) {
                        setActivity();
                        return;
                    }

                    FindService.editUserProfile(editData)
                        .then(setActivity)
                        .catch(error);
                } else {
                    setActivity();
                }

            } else {
                setActivity();
            }
        }

        //提交活动报名
        function setActivity() {
            var sendData = {
                actId:$scope.activityName,
                entityName:$scope.suggestOrganizationObj.word,
                realName:$scope.user.name,
                investorRole: getInvestorRole($scope.invest.investorRole),
                entityType: entityType($scope.invest.investorRole)
            };
            if ($scope.detailHasChange) {
                var link   = $scope.invest.pictures || $scope.investorValidateForm.pictures.uploaded;
                sendData.bizCard = link;
            }

            ActivityService.investorSignUp(sendData)
                .then(function temp() {
                    $state.go('frInvestorSuccess', {
                        activityName: $scope.activityName
                    });
                })
                .catch(error);
        }

        function getInvestorTypeNumber(type) {
            var INVESTOR_TYPE_META = {
                PERSONAL_INVESTOR: 1,
                ORG_INVESTOR: 0
            };
            if (type === 'PERSONAL_INVESTOR') {
                return INVESTOR_TYPE_META[type];
            } else {
                return $scope.organization.addForm.type;
            }
        }

        function entityType(type) {
            if (type === 2 || type === '2') {
                return 'INDIVIDUAL';
            } else if (type === 0 || type === '0') {
                return 'ORGANIZATION';
            }
        }

        function getInvestorRole(type) {
            if (type === 2 || type === '2') {
                return 'PERSONAL_INVESTOR';
            } else if (type === 0 || type === '0') {
                return 'ORG_INVESTOR';
            }
        }

        function error(err) {
            ErrorService.alert(err);
        }

        function initH3() {
            if (document.applierType) {
                vm[document.applierType.toLowerCase() + 'h3'] = true;
            }
        }
    }
);
