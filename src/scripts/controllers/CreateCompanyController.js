var angular = require('angular');

angular.module('defaultApp.controller').controller('CreateCompanyController', [
    '$modal',
    '$scope',
    'DictionaryService',
    'dateFilter',
    'DefaultService',
    'CompanyService',
    'SuggestService',
    'monthOptions',
    'yearOptions',
    '$state',
    'UserService',
    'ErrorService',
    'AvatarEdit',
    '$upload',
    function ($modal, $scope, DictionaryService, dateFilter, DefaultService, CompanyService, SuggestService, monthOptions, yearOptions, $state, UserService, ErrorService, AvatarEdit, $upload) {

        // 职位
        $scope.founderRoles = DictionaryService.getDict('StartupPositionType');
        // 产品状态
        $scope.operationStatus = DictionaryService.getDict('CompanyOperationStatus');

        $scope.yearOptions = yearOptions;

        $scope.monthOptions = monthOptions;

        $scope.formData = {
            level: $scope.founderRoles[0].value,
            logo: "",
            operationStatus: $scope.operationStatus[1].value
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
                    function ($scope, $modalInstance, scope) {
                        $scope.ok = function () {
                            $modalInstance.dismiss();
                        }
                    }
                ],
                resolve: {
                    scope: function () {
                        return $scope;
                    }
                }

            });
        }
        // 重要提示 end




        // 上传logo start
        $scope.logo = {};
        $scope.logoFileSelected = function (files, e) {
            var upyun = window.kr.upyun;
            if (files[0].size > 5 * 1024 * 1024) {
                ErrorService.alert({
                    msg: "附件大于5M"
                });
                return;
            }
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
                    }).success(function (data, status, headers, config) {
                        var filename = data.url.toLowerCase();
                        if (filename.indexOf('.jpg') != -1 || (filename.indexOf('.png') != -1) || filename.indexOf('.gif') != -1) {
                            $scope.formData.logo = window.kr.upyun.bucket.url + data.url;
                        } else {
                            ErrorService.alert({
                                msg: '格式不支持，请重新上传！'
                            });
                        }
                        $scope.logo.uploading = false;
                    }).error(function () {
                        ErrorService.alert({
                            msg: '格式不支持，请重新上传！'
                        });
                        $scope.logo.uploading = false;
                    });
                }, function (err) {
                    $scope.logo.uploading = false;
                    ErrorService.alert(err);
                });
            }
        };
        // 上传logo end


        // 上传名片 start
        $scope.card = {};
        $scope.cardFileSelected = function (files, e) {
            var upyun = window.kr.upyun;
            if (files[0].size > 5 * 1024 * 1024) {
                ErrorService.alert({
                    msg: "附件大于5M"
                });
                return;
            }
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
                    }).success(function (data, status, headers, config) {
                        var filename = data.url.toLowerCase();
                        if (filename.indexOf('.jpg') != -1 || (filename.indexOf('.png') != -1) || filename.indexOf('.gif') != -1) {
                            $scope.formData.bizCardLink = window.kr.upyun.bucket.url + data.url;
                        } else {
                            ErrorService.alert({
                                msg: '格式不支持，请重新上传！'
                            });
                        }
                        $scope.card.uploading = false;
                    }).error(function () {
                        ErrorService.alert({
                            msg: '格式不支持，请重新上传！'
                        });
                        $scope.card.uploading = false;
                    });
                }, function (err) {
                    $scope.card.uploading = false;
                    ErrorService.alert(err);
                });
            }
        };
        // 上传名片 end



        //提交表单 start
        $scope.submitting = false;
        $scope.submitForm = function(e,callback ){
            e && e.preventDefault();
            if(!$scope.formData.bizCardLink) {
                ErrorService.alert({
                    msg:"请上传名片！"
                });
                return;
            }
            if(!$scope.formData.logo) {
                ErrorService.alert({
                    msg:"请上传公司LOGO！"
                });
                return;
            }

            // if($scope.formData.productStatusName == 'OPEN') {
            //     $scope.formData.productStatus = 0;
            // } else if($scope.formData.productStatusName == 'CLOSED') {
            //     $scope.formData.productStatus = 1;
            // } else if($scope.formData.productStatusName == 'UNSTART') {
            //     $scope.formData.productStatus = -1;
            // }

            Object.keys($scope.createForm).forEach(function(key){
                if($scope.createForm[key]&&$scope.createForm[key].$setDirty){
                    $scope.createForm[key].$setDirty();
                }
            });
            if($scope.submitting || $scope.createForm.$invalid){
                return;
            }
            $scope.submitting = true;

            CompanyService.save(angular.copy($scope.formData),function(data){
                if(callback){
                    callback(data.id);
                    return;
                }
                $state.go('companys.detail.overview', {
                    id: data.id
                });
            }, function(err){
                ErrorService.alert(err);
                $scope.submitting = false;
            });
        };
        // 提交表单 end



    }]).service('SuggestService', [function () {
    this.aaa = 1
}])

