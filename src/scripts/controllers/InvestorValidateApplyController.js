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

        function initInvestor() {
            $scope.investorErrorGroup = UserService.investorErrorGroup;

            $scope.investorValidateApply = {
                status:''
            };

            /*查询投资人认证申请状态*/
            InvestorauditService.queryStatus({}, function (response) {
                //response.status = -1;
                switch (response.status){
                    /*审核中*/
                    case 0:
                        $scope.investorValidateApply.status = 'checking';
                        break;
                    /*审核通过*/
                    case 1 :
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

            //获取工作职位
            $scope.workPositionType = DictionaryService.getDict('WorkPositionType');
            $scope.orgPositionType = DictionaryService.getDict('OrgPositionType');

            //获取年月份
            $scope.yearOptions = yearOptions;
            $scope.monthOptions = monthOptions;

            var myDate = new Date();
            var year = myDate.getFullYear();
            var month = myDate.getMonth() + 1;

            $scope.$watchGroup(['organization.form.startMonth', 'organization.form.startYear'], function () {
                if (!$scope.investorValidateForm.time) {
                    return;
                }

                if ($scope.organization.form.startYear && $scope.organization.form.startYear === year + '') {
                    if ($scope.organization.form.startMonth > month) {
                        $scope.investorValidateForm.time.$setValidity('now', false);
                    } else {
                        $scope.investorValidateForm.time.$setValidity('now', true);
                    }
                } else {
                    $scope.investorValidateForm.time.$setValidity('now', true);
                }

                if (!$scope.organization.form.startYear || !$scope.organization.form.startMonth) {
                    $scope.investorValidateForm.time.$setValidity('time', false);
                } else {
                    $scope.investorValidateForm.time.$setValidity('time', true);
                }
            });

            $scope.$watchGroup(['company.form.startMonth', 'company.form.startYear'], function () {
                if (!$scope.investorValidateForm.time) {
                    return;
                }

                if ($scope.company.form.startYear && $scope.company.form.startYear === year + '') {
                    if ($scope.company.form.startMonth > month) {
                        $scope.investorValidateForm.time.$setValidity('now', false);
                    } else {
                        $scope.investorValidateForm.time.$setValidity('now', true);
                    }
                } else {
                    $scope.investorValidateForm.time.$setValidity('now', true);
                }

                if (!$scope.company.form.startYear || !$scope.company.form.startMonth) {
                    $scope.investorValidateForm.time.$setValidity('time', false);
                } else {
                    $scope.investorValidateForm.time.$setValidity('time', true);
                }
            });
        }

        initInvestor();

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

        //function logdiv(msg) {
        //    if (!$('.logdiv').length) {
        //        $('<div class="logdiv" style="position: fixed; top: 0;left: 0;' +
        //            'width: 100px;height: 100px;' +
        //            'background-color: #cccc99;z-index: 999;"></div>'
        //        ).appendTo('body');
        //    }
        //
        //    $('.logdiv').html(msg);
        //}

        //android客户端
        $scope.androidUpload = function (scope, event) {
            AndroidUploadService.setClick(function (filename) {
                $scope.$apply(function () {
                    //logdiv(filename);
                    scope.$setValidity('required', true);
                    scope.uploaded = filename;
                });
            })(event);
        };

        $scope.imgFileSelected  = function (scope, files) {
            var upyun = window.kr.upyun;
            if (files[0].size > 5 * 1024 * 1024) {
                scope.$setValidity('size', true);
                return;
            }

            scope.temp = '';
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
                        reader.onload = function () {
                            scope.temp = reader.result;
                        };

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
                        scope.temp = '';
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
                $scope.organization.isAddExperience = true;
                $scope.organization.addForm.id = 0;
            },

            on_select: function (selected) {
                $scope.organization.isAdd = false;
                var organization = selected.obj;
                $scope.organization.addForm.name = organization.name;
                $scope.organization.addForm.id = organization.id;
            }
        };

        $scope.suggestCompanyObj = {};
        $scope.suggestCompanyOption = {
            on_leaveSelect: function (val) {
                $scope.company.isAdd = true;
                $scope.company.isAddExperience = true;
                $scope.company.addForm.name = val;
                $scope.company.addForm.id = 0;
            },

            on_select: function (selected) {
                $scope.company.isAdd = false;
                var company = selected.obj;
                $scope.company.addForm.name = company.name;
                $scope.company.addForm.id = company.id;
            }
        };

        //任职公司
        $scope.company = {
            isAddExperience:false,
            isAdd:false,
            form:{
                startYear:'',
                startMonth:'',
                position:'',
                groupName:'',
            },
            addForm:{
                id:'',
                name:'',
                brief:'',
                operationStatus:'OPEN'
            },
            response:{
                data:[]
            },
            choose:function () {// todo 优化
                var companyId = $scope.company.form.id;
                var   companyData = $scope.company.response.data;
                var    company = {};

                if (companyId === 0) {
                    $scope.company.isAddExperience = true;
                    angular.extend($scope.company.form, {
                        startYear:'',
                        startMonth:'',
                        position:''
                    });

                    angular.extend($scope.company.addForm, {
                        id:'',
                        name:'',
                        brief:'',
                        operationStatus:'OPEN'
                    });
                    return false;
                }

                $scope.company.isAddExperience = false;
                $scope.company.isAdd = false;

                angular.forEach(companyData, function (item) {
                    if (companyId === item.id) {
                        company = item;
                        return true;
                    }
                });

                angular.extend($scope.company.form, angular.copy(company));
                var startDate = new Date(company.startDate);
                $scope.company.form.startYear = startDate.getFullYear() + '';
                $scope.company.form.startMonth = 1 + startDate.getMonth() + '';

            },

            loadData:function () {
                //获取当前用户在职公司工作经历
                UserService.getCurrentWorkCompanys(UserService.getUID(), function (response) {
                    $scope.company.response.data = angular.copy(response.expList);
                    $scope.company.response.data.push({
                        id:0,
                        groupName:'新增经历'
                    });
                    $scope.company.form.id = 0;
                    $scope.company.isAddExperience = true;
                }, function (err) {

                    ErrorService.alert(err);
                });
            }

        };
        $scope.company.loadData();

        //任职机构
        $scope.organization = {
            isAddExperience:false,
            isAdd:false,
            form:{
                startYear:'',
                startMonth:'',
                position:''
            },
            addForm:{
                id:'',
                name:'',
                brief:''
            },
            response:{
                data:[]
            },
            choose:function () {// todo 优化
                var orId = $scope.organization.form.id;
                var organizationData = $scope.organization.response.data;
                var organization = {};

                //新增机构工作经历
                if (orId === 0) {
                    $scope.organization.isAddExperience = true;
                    angular.extend($scope.organization.form, {
                        startYear:'',
                        startMonth:'',
                        position:''
                    });

                    angular.extend($scope.organization.addForm, {
                        id:'',
                        name:'',
                        brief:''
                    });

                    return false;
                }

                $scope.organization.isAddExperience = false;
                $scope.organization.isAdd = false;

                angular.forEach(organizationData, function (item) {
                    if (orId === item.id) {
                        organization = item;
                        return true;
                    }

                });

                angular.extend($scope.organization.form, angular.copy(organization));
                var startDate = new Date(organization.startDate);
                $scope.organization.form.startMonth =  1 + startDate.getMonth() + '';
                $scope.organization.form.startYear = startDate.getFullYear() + '';
            },

            loadData:function () {
                //获取当前用户在职机构工作经历
                UserService.getCurrentWorkOrganizations(UserService.getUID(), function (response) {
                    $scope.organization.response.data = angular.copy(response.expList);
                    $scope.organization.response.data.push({
                        id:0,
                        groupName:'新增经历'
                    });
                    $scope.organization.form.id = 0;
                    $scope.organization.isAddExperience = true;
                }, function (err) {

                    ErrorService.alert(err);
                });
            }

        };
        $scope.organization.loadData();

        // 上传logo start
        $scope.logo = {};

        //投资人认证表单
        $scope.intro = {};

        $scope.hasClick = false;
        /*表单提交*/
        $scope.submitForm = function () {

            //创建机构
            function createOrganization(data) {
                return OrganizationService.save(data).$promise;
            }

            //创建任职经历
            function createExperience(data) {
                return UserService.addWorkExperience(data);
            }

            //更新任职经历
            function updateExperience(data) {
                return UserService.updateWorkExperience(data);
            }

            //发送投资人认证数据
            function send(workExpId) {
                if (workExpId) {
                    investoraudit.workExpId = workExpId;
                }

                InvestorauditService.save(investoraudit, function () {
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

            if ($scope.investorValidateForm.pictures.uploaded || $scope.invest.pictures) {
                $scope.investorValidateForm.pictures.$setValidity('required', true);
            } else {
                $scope.investorValidateForm.pictures.$setValidity('required', false);
                return false;
            }

            var investoraudit = {};
            investoraudit.id = UserService.getUID();
            investoraudit.name   = $scope.user.name;
            investoraudit.investorRole   = $scope.invest.investorRole;
            investoraudit.intro   = $scope.invest.intro;
            /*名片*/
            investoraudit.businessCardLink   = $scope.invest.pictures || $scope.investorValidateForm.pictures.uploaded;

            window.localStorage && localStorage.setItem('invest', JSON.stringify($scope.invest));

            $scope.hasClick = true;

            //判断投资身份
            var investorRole  = $scope.invest.investorRole;
            var data;
            var expData;
            var deferred;
            var userPromise;
            var organizationPromise;
            var experiencePromise;
            var then;

            switch (investorRole){
                //任职机构
                case 'ORG_INVESTOR': {
                    then = function () {
                        console.log('---任职机构');
                        if ($scope.organization.isAddExperience && $scope.organization.isAdd) {
                            data = angular.copy($scope.organization.addForm);
                            data.source = 'INVESTOR_AUDIT';

                            organizationPromise = createOrganization(data);
                        } else {
                            $scope.organization.addForm.name;
                        }

                        expData = {};
                        expData.uid = UserService.getUID();
                        expData.groupIdType = 2;
                        expData.current = true;
                        expData.groupName = $scope.organization.isAddExperience ?
                            $scope.organization.addForm.name : $scope.organization.form.groupName;
                        expData.position = $scope.organization.form.position;
                        expData.startDate = $scope.organization.form.startYear + '-' + $scope.organization.form.startMonth + '-01 01:01:01';

                        if (organizationPromise) {
                            organizationPromise.then(function (response) {
                                return expData.groupId = response.id;
                            }, function (err) {

                                ErrorService.alert({
                                    msg: '对不起，该机构不符合平台收录标准'
                                });
                                $scope.hasClick = false;
                                console.log('---创建公司失败--', err, err.msg.indexOf('10次'), err.msg.indexOf('不符合'));
                            });
                        } else {
                            expData.id = $scope.organization.form.id;
                            expData.groupId = $scope.organization.addForm.id || $scope.organization.form.groupId;
                            deferred = $q.defer();
                            organizationPromise = deferred.promise;
                            deferred.resolve();
                        }

                        organizationPromise.then(function () {
                            return $scope.organization.isAddExperience ?
                                createExperience(expData) : updateExperience(expData);
                        }).then(function (response) {
                            console.log('--创建经历成功--');
                            send(response.data.id);
                        }, function (err) {

                            $scope.hasClick = false;
                            ErrorService.alert({
                                msg: err.msg
                            });
                            console.log('--创建经历失败--');
                        });
                    };
                }

                    break;

                //任职公司
                case 'COMPANY_INVEST_DEPT': {
                    then = function () {
                        console.log('---任职公司');

                        expData = {};
                        expData.uid = UserService.getUID();
                        expData.groupIdType = 3;
                        expData.current = true;

                        expData.groupId = $scope.company.isAddExperience ?
                            $scope.company.addForm.id : $scope.company.form.groupId;
                        expData.groupName = $scope.company.isAddExperience ?
                            $scope.company.addForm.name : $scope.company.form.groupName;
                        expData.position = $scope.company.form.position;
                        expData.startDate = $scope.company.form.startYear + '-' + $scope.company.form.startMonth + '-01 01:01:01';

                        if (!$scope.company.isAddExperience) {
                            expData.id = $scope.company.form.id;
                        }

                        experiencePromise = $scope.company.isAddExperience ?
                            createExperience(expData) : updateExperience(expData);

                        experiencePromise.then(function (response) {
                            console.log('--创建经历成功--');
                            send(response.data.id);
                        }, function (err) {

                            $scope.hasClick = false;
                            ErrorService.alert({
                                msg: err.msg
                            });
                            console.log('--创建经历失败--');
                        });
                    };
                }

                    break;

                default: {
                    then = function () {
                        console.log('--个人投资人--');
                        send();
                    };
                }

                    break;
            }

            if ($scope.investorValidateApply.status === 'new') {
                userPromise = UserService.basic.update({
                    id: $scope.user.id
                }, {
                    avatar: $scope.user.avatar || $scope.guideForm.avatar.uploaded,
                    name: $scope.user.name,
                    email: $scope.user.email,
                    phone: $scope.getPhoneWithCountryCode(),
                    smscode: $scope.user.smscode
                }).$promise.then(then, function (err) {
                    $scope.hasClick = false;
                    ErrorService.alert({
                        msg: err.msg
                    });
                });
            } else {
                then();
            }
        };

    }
);
