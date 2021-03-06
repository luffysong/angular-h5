
// jscs:disable  requireCamelCaseOrUpperCaseIdentifiers
var angular = require('angular');

angular.module('defaultApp.controller').controller('CreateCompanyController', [
    '$stateParams',
    '$timeout',
    '$q',
    '$modal',
    '$scope',
    'DictionaryService',
    'dateFilter',
    'DefaultService',
    'AndroidUploadService',
    'CompanyService',
    'SuggestService',
    'monthOptions',
    'yearOptions',
    '$state',
    'UserService',
    'ErrorService',
    'AvatarEdit',
    '$upload',
    '$http',

    function ($stateParams, $timeout, $q, $modal, $scope, DictionaryService, dateFilter, DefaultService, AndroidUploadService,
            CompanyService, SuggestService, monthOptions, yearOptions, $state, UserService, ErrorService, AvatarEdit, $upload) {
        //console.log($stateParams)
        if ($stateParams.from && decodeURIComponent($stateParams.from).indexOf('speed10') > -1) {
            $scope.jisu = true;
            $.ajax('/api/speed/count/click-create-hook', {
                type:'GET'
            });
        }

        //android客户端
        $scope.androidUpload = AndroidUploadService.setClick(function (filename) {
            $scope.$apply(function () {
                if (window.kr36 && window.kr36.tempCache && window.kr36.tempCache.imgsource) {
                    $scope.formData[window.kr36.tempCache.imgsource] = filename;
                    angular.element($('form[name="createForm"]')).scope().createForm.$setValidity('cardEmpty', true);
                }

            });
        });

        //console.log($scope.androidUpload)

        // 职位
        $scope.founderRoles = DictionaryService.getDict('StartupPositionType');

        // 产品状态
        $scope.operationStatus = DictionaryService.getDict('CompanyOperationStatus');

        // url 黑名单
        $scope.urlblacklist = DictionaryService.getDict('CompanyUrlBlacklist');

        // 所属行业 一级
        $scope.industry = DictionaryService.getDict('CompanyIndustry').filter(function (el) {
            if (el.desc !== '非TMT') {
                return el;
            }
        });

        // 所属行业 二级
        $scope.industry2 = [];
        $scope.selectIndustryObj = {
            industryObj:'',
            industry2Obj:''
        };

        $scope.yearOptions = yearOptions;

        $scope.monthOptions = monthOptions;

        $scope.formData = {
            level: $scope.founderRoles[0].value,
            logo: '//pic.36krcnd.com/default_logo.png!70',
            operationStatus: $scope.operationStatus[1].value,
            website:''
        };

        $scope.uid = UserService.getUID();

        //UserService.isProfileValid(function (cs) {
        //    if(!cs){
        //        $state.go('guide.welcome');
        //        return false;
        //    }
        //
        //});

        // 公司网址
        $scope.webSiteFocus = function () {
            if (!$scope.formData.website) {
                $scope.formData.website = 'http://';
            }
        };

        $scope.webSiteBlur = function () {
            if ($scope.formData.website === 'http://') {
                $scope.formData.website = '';
            }
        };

        $scope.websiteChange = function () {
            angular.element($('form[name="createForm"]'))
                .scope()
                .createForm
                .$setValidity('urlblacklist', true);
        };

        console.log($scope.formData.industry);

        // 切换一级行业 监听事件操作
        $scope.industryChange = function () {
            if (!$scope.selectIndustryObj.industryObj) {
                return;
            }

            $scope.formData.industry = $scope.selectIndustryObj.industryObj.value;
            $scope.industry2 = '';

            //console.log($scope.formData.industry)
            CompanyService.getIndustry2($scope.selectIndustryObj.industryObj.id).then(function (data) {
                $scope.industry2 = data.data;
            }, function () {

            });
        };

        $scope.industry2Change = function () {
            $scope.formData.industry2 = $scope.selectIndustryObj.industry2Obj.id;
            console.log($scope.formData.industry2);
        };

        // 定位
        $scope.positionSet = function (e) {
            e.preventDefault();
            var wrap = $('.suggest_wrap');
            var top = wrap.offset().top;

            window.scrollTo(0, top - 30);

            //$('input', wrap)[0].removeAttribute('disabled')

            //setTimeout(function(){
            //    $('input', wrap).focus();
            //
            //}, 500)
        };

        // 重要提示 start
        $scope.createTip = function () {
            $modal.open({
                templateUrl: 'templates/company/create_tip.html',
                windowClass: 'pop_create_tip_wrap',
                controller: [
                    '$scope',
                    '$modalInstance',
                    'scope',
                    function ($scope, $modalInstance) {
                        $scope.ok = function () {
                            $modalInstance.dismiss();
                        };
                    }
                ],
                resolve: {
                    scope: function () {
                        return $scope;
                    }
                }

            });
        };

        // 重要提示 end

        // suggest start

        $scope.suggest = {
            add: []
        };

        // add new company
        $scope.formData.operationStatus = 'OPEN';

        $scope.addCompany = function (name) {
            $scope.opNext = 0;
            $scope.formData.name = name;
            $scope.formData.website = '';
            $scope.formData.brief = '';
            $scope.formData.logo = '';
            $scope.formData.full_name = '';

            $scope.formData.bizCardLink = '';
            $scope.formData.cid = null;
            $scope.temp_logo = '';
            $scope.temp_bizCardLink = '';

            $scope.formData.industry = '';
            $scope.formData.industry2 = '';
        };

        // add new company  end

        // 判断
        $scope.opNext = 0;

        // 获取已存在公司信息
        function checkName(selected) {
            CompanyService.checkName({
                name: selected.obj.name
            }, function (data) {
                data.company.logo = selected.obj.logo;
                var company = data.company;
                if (data.manager) {
                    $scope.opNext = 2;
                    $scope.founder = data.manager.name;
                    $scope.founderid = data.manager.id;
                } else {
                    $scope.opNext = 1;
                }

                if (data.creatable) {
                    $scope.opNext = 0;
                }

                $scope.formData.cid = company.id;
                $scope.formData.name = company.name;
                $scope.formData.full_name = company.fullName;
                $scope.formData.website = company.website;
                $scope.formData.brief = company.brief;
                $scope.formData.logo = company.logo;
                $scope.formData.operationStatus = company.operationStatus;
                $scope.formData.creatable = data.creatable;
                $scope.formData.inputLength = $scope.formData.brief.length || 0;

                $scope.formData.industry = company.industry;
                $scope.formData.industry2 = company.industry2;
                $.each($scope.industry, function (i, el) {
                    if (el.value === $scope.formData.industry) {
                        $scope.selectIndustryObj.industryObj = el;

                        CompanyService.getIndustry2($scope.selectIndustryObj.industryObj.id).then(function (data) {
                            $scope.industry2 = data.data;

                            $.each($scope.industry2, function (i, el) {
                                if (el.id === $scope.formData.industry2) {
                                    $scope.selectIndustryObj.industry2Obj = el;
                                }
                            });
                        }, function () {

                        });
                    }
                });
            });
        }

        var name_cache = '';
        $scope.suggestObj = {
            on_error: console.log,
            on_leaveSelect: function (val) {
                $scope.addCompany(val);
                name_cache = val;
            },

            on_select: function (selected) {
                checkName(selected);
            }
        };

        // suggest end

        // 上传logo start
        $scope.logo = {};
        $scope.logoFileSelected = function (files) {
            var upyun = window.kr.upyun;
            if (files[0].size > 5 * 1024 * 1024) {
                //ErrorService.alert({
                //    msg: "附件大于5M"
                //});
                angular.element($('form[name="createForm"]'))
                    .scope()
                    .createForm
                    .$setValidity('logoSize', true);
                return;
            }

            $scope.temp_logo = '';
            $scope.formData.logo = '';
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $scope.logo.uploading = true;
                $scope.logo.progress = 0;
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
                        $scope.logo.progress = evt.loaded * 100 / evt.total;
                    }).success(function (data) {

                        var reader = new FileReader();
                        reader.onload = function () {

                            //$('.J_aa')[0].src = reader.result

                            $scope.temp_logo = reader.result;

                        };

                        var filename = data.url.toLowerCase();
                        if (filename.indexOf('.jpg') !== -1 || (filename.indexOf('.png') !== -1) ||
                                filename.indexOf('.jpeg') !== -1) {

                            reader.readAsDataURL(file);
                            $scope.formData.logo = window.kr.upyun.bucket.url + data.url;

                            angular.element($('form[name="createForm"]')).scope().createForm.$setValidity('logoEmpty', true);
                        } else {
                            //ErrorService.alert({
                            //    msg: '格式不支持，请重新上传！'
                            //});
                            angular.element($('form[name="createForm"]')).scope().createForm.$setValidity('logoType', true);
                        }

                        $scope.logo.uploading = false;
                        $scope.temp_logo = '';
                    }).error(function (err) {
                        //ErrorService.alert({
                        //    msg: '格式不支持，请重新上传！'
                        //});
                        angular.element($('form[name="createForm"]')).scope().createForm.$setValidity('serverError', false);
                        $scope.serverErrorMsg = err.msg;

                        $timeout(function () {
                            angular.element($('form[name="createForm"]')).scope().createForm.$setValidity('serverError', true);
                        }, 4000);

                        $scope.logo.uploading = false;
                    });
                }, function (err) {

                    $scope.logo.uploading = false;

                    //ErrorService.alert(err);
                    angular.element($('form[name="createForm"]')).scope().createForm.$setValidity('serverError', false);
                    $scope.serverErrorMsg = err.msg;

                    $timeout(function () {
                        angular.element($('form[name="createForm"]')).scope().createForm.$setValidity('serverError', true);
                    }, 4000);
                });
            }
        };

        // 上传logo end

        // 上传名片 start
        $scope.card = {};
        $scope.cardFileSelected = function (files) {
            var upyun = window.kr.upyun;
            if (files[0].size > 5 * 1024 * 1024) {
                //ErrorService.alert({
                //    msg: "附件大于5M"
                //});
                angular.element($('form[name="createForm"]')).scope().createForm.$setValidity('logoSize', true);
                return;
            }

            $scope.temp_bizCardLink = '';
            $scope.formData.bizCardLink = '';
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $scope.card.uploading = true;
                $scope.card.progress = 0;
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
                        $scope.card.progress = evt.loaded * 100 / evt.total;
                    }).success(function (data) {

                        var reader = new FileReader();
                        reader.onload = function () {

                            //$('.J_aa')[0].src = reader.result

                            $scope.temp_bizCardLink = reader.result;

                        };

                        var filename = data.url.toLowerCase();
                        if (filename.indexOf('.jpg') !== -1 || (filename.indexOf('.png') !== -1) ||
                                filename.indexOf('.jpeg') !== -1) {

                            reader.readAsDataURL(file);

                            $scope.formData.bizCardLink = window.kr.upyun.bucket.url + data.url;
                            angular.element($('form[name="createForm"]')).scope().createForm.$setValidity('cardEmpty', true);
                        } else {
                            //ErrorService.alert({
                            //    msg: '格式不支持，请重新上传！'
                            //});
                            angular.element($('form[name="createForm"]')).scope().createForm.$setValidity('cardType', true);
                        }

                        $scope.card.uploading = false;

                        $scope.temp_bizCardLink = '';
                    }).error(function (err) {
                        //ErrorService.alert({
                        //    msg: '格式不支持，请重新上传！'
                        //});
                        angular.element($('form[name="createForm"]')).scope().createForm.$setValidity('serverError', false);
                        $scope.serverErrorMsg = err.msg;

                        $timeout(function () {
                            angular.element($('form[name="createForm"]')).scope().createForm.$setValidity('serverError', true);
                        }, 4000);

                        $scope.card.uploading = false;
                    });
                }, function (err) {

                    $scope.card.uploading = false;

                    //ErrorService.alert(err);
                    angular.element($('form[name="createForm"]')).scope().createForm.$setValidity('serverError', false);
                    $scope.serverErrorMsg = err.msg;

                    $timeout(function () {
                        angular.element($('form[name="createForm"]')).scope().createForm.$setValidity('serverError', true);
                    }, 4000);
                });
            }
        };

        // 上传名片 end

        //新建公司 start
        $scope.submitting = false;
        $scope.submitForm = function (e) {
            e && e.preventDefault();

            // if (!$scope.formData.bizCardLink) {
            //     //ErrorService.alert({
            //     //    msg: "请上传名片！"
            //     //});
            //     angular.element($("form[name='createForm']")).scope()["createForm"].$setValidity("cardEmpty", false);
            //     return;
            // }
            if (!$scope.formData.logo && !$scope.formData.cid) {
                //ErrorService.alert({
                //    msg: "请上传公司LOGO！"
                //});
                angular.element($('form[name="createForm"]')).scope().createForm.$setValidity('logoEmpty', false);
                return;
            }else {
                angular.element($('form[name="createForm"]')).scope().createForm.$setValidity('logoEmpty', true);
            }

            // 校验公司黑名单
            if (!$scope.formData.cid) {
                for (var i = 0; i < $scope.urlblacklist.length; i++) {
                    if ($scope.formData.website.indexOf('.' + $scope.urlblacklist[i]) > -1 || $scope.formData.website.indexOf('//' + $scope.urlblacklist[i]) > -1) {
                        angular.element($('form[name="createForm"]')).scope().createForm.$setValidity('urlblacklist', false);
                        return;
                    }
                }

                angular.element($('form[name="createForm"]')).scope().createForm.$setValidity('urlblacklist', true);
            }

            //if(!$scope.formData.industry){
            //    angular.element($("form[name='createForm']")).scope()["createForm"].$setValidity("industry", false);
            //}else{
            //    angular.element($("form[name='createForm']")).scope()["createForm"].$setValidity("industry", true);
            //}

            Object.keys($scope.createForm).forEach(function (key) {
                if ($scope.createForm[key] && $scope.createForm[key].$setDirty) {
                    $scope.createForm[key].$setDirty();
                }
            });

            if ($scope.submitting || $scope.createForm.$invalid) {
                return;
            }

            $scope.submitting = true;
            $scope.formData.companySource = 'H5_CREATION';

            //if($scope.formData.cid){

            // todo : 时间修复
            $scope.formData.startDate = $scope.formData.startYear + '-' + $scope.formData.startMonth + '-01';
            if (!$scope.formData.logo) {
                $scope.formData.logo = '//pic.36krcnd.com/default_logo.png!30';
            }

            CompanyService.save({
                mode: 'direct'
            }, angular.copy($scope.formData), function (data) {
                if ($scope.jisu) {
                    location.href = '/m/j5companycreate.html?cid=' + data.id;
                }else {
                    location.hash = '/company_create_apply';
                }

                if ($stateParams.from) {
                    location.hash = '/company_create_apply?from=' + $stateParams.from + '&cid=' + data.id;
                } else {
                    location.hash = '/company_create_apply';
                }

                //if (callback) {
                //    callback(data.id);
                //    return;
                //}
                //$state.go('companys.detail.overview', {
                //    id: data.id
                //});
            }, function (err) {
                //ErrorService.alert(err);
                angular.element($('form[name="createForm"]')).scope().createForm.$setValidity('serverError', false);
                $scope.serverErrorMsg = err.msg;

                $timeout(function () {
                    angular.element($('form[name="createForm"]')).scope().createForm.$setValidity('serverError', true);
                }, 4000);

                $scope.submitting = false;
            });

            //}else{

            //}

        };

        // 新建公司 end

        // 申请认领 start
        //$scope.applyStatus = true;
        $scope.applyUnclaimed = function (e) {
            e && e.preventDefault();
            if (!$scope.formData.bizCardLink) {
                //ErrorService.alert({
                //    msg: "请上传名片！"
                //});
                angular.element($('form[name="createForm"]')).scope().createForm.$setValidity('cardEmpty', false);
                return;
            }

            Object.keys($scope.createForm).forEach(function (key) {
                if ($scope.createForm[key] && $scope.createForm[key].$setDirty) {
                    $scope.createForm[key].$setDirty();
                }
            });

            if ($scope.submitting || $scope.createForm.$invalid) {
                return;
            }

            $scope.submitting = true;
            var cid = $scope.formData.cid;

            // delete未知原因的添加
            // delete $scope.formData.cid;
            $scope.claimedCid = cid;
            CompanyService.claim({
                id: cid
            }, angular.copy($scope.formData), function () {

                $scope.submitting = false;
                $scope.applyStatus = false;

                location.hash = '/company_create_apply';

            }, function (err) {

                $scope.submitting = false;
                $scope.applyStatus = true;

                //if (err.msg) {
                //    ErrorService.alert(err);
                //}
                angular.element($('form[name="createForm"]')).scope().createForm.$setValidity('serverError', false);
                $scope.serverErrorMsg = err.msg;

                $timeout(function () {
                    angular.element($('form[name="createForm"]')).scope().createForm.$setValidity('serverError', true);
                }, 4000);
            });
        };

        // 申请认领 end

        // 添加为我的创业经历 start
        $scope.addStatus = true;
        $scope.addEntrepreneurialExp = function (e) {
            e && e.preventDefault();
            if (!$scope.formData.bizCardLink) {
                //ErrorService.alert({
                //    msg: "请上传名片！"
                //});
                angular.element($('form[name="createForm"]')).scope().createForm.$setValidity('cardEmpty', false);
                return;
            }

            Object.keys($scope.createForm).forEach(function (key) {
                if ($scope.createForm[key] && $scope.createForm[key].$setDirty) {
                    $scope.createForm[key].$setDirty();
                }
            });

            if ($scope.submitting || $scope.createForm.$invalid) {
                return;
            }

            $scope.submitting = true;
            var cid = $scope.formData.cid;
            delete $scope.formData.cid;

            UserService.company.save({
                id: UserService.getUID()
            }, {
                groupIdType: 3,
                groupId: cid,
                position: $scope.formData.level,
                positionDetail: $scope.formData.position,
                startYear: $scope.formData.startYear,
                startMonth: $scope.formData.startMonth,
                endYear: $scope.formData.endYear,
                endMonth: $scope.formData.endMonth,
                isCurrent: ($scope.formData.isCurrent ? true : false),
                operationStatus: $scope.formData.operationStatus,
                bizCardLink: $scope.formData.bizCardLink
            }, function () {
                $scope.submitting = false;
                $scope.addStatus = false;

                location.hash = '/company_create_apply';

            }, function (err) {

                $scope.submitting = false;
                $scope.addStatus = true;

                //if (err.msg) {
                //    alert(err.msg);
                //}
                angular.element($('form[name="createForm"]')).scope().createForm.$setValidity('serverError', false);
                $scope.serverErrorMsg = err.msg;

                $timeout(function () {
                    angular.element($('form[name="createForm"]')).scope().createForm.$setValidity('serverError', true);
                }, 4000);
            });

        };

        // 添加为我的创业经历 end

        $scope.checkDate = function () {
            if ($scope.formData.startYear && $scope.formData.startMonth) {
                var selectTime = $scope.formData.startYear + '/' + $scope.formData.startMonth + '/1';
                if (new Date(selectTime) - 0 > (new Date() - 0)) {
                    angular.element($('form[name="createForm"]')).scope().createForm.$setValidity('timeLimit', false);
                }else {
                    angular.element($('form[name="createForm"]')).scope().createForm.$setValidity('timeLimit', true);
                }
            }
        };

    }]);

/*service('SuggestService', [
    '$http',
    'BasicService',
    function ($http, BasicService) {
        var service = BasicService("/api/suggest/company", {})

        return service;
    }])*/
