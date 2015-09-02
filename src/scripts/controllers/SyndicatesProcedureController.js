var angular = require('angular');

angular.module('defaultApp.controller').controller('SyndicatesProcedureController', [
    '$scope', '$state', 'notify', '$stateParams', 'CrowdFundingService', 'ErrorService', 'AuditService', 'checkForm', '$upload', 'notify', 'DefaultService',
    function($scope,  $state, notify, $stateParams, CrowdFundingService, ErrorService, AuditService, checkForm, $upload, notify, DefaultService) {
        //处理参数
        $scope.params = {};
        $scope.params.cfid = $stateParams.cfid || 0;

        if(!$scope.params.cfid) {
            return $state.go('syndicatesAllOrder');
        }

        // 手续进度详情
        $scope.formality = {};
        CrowdFundingService.query({
            'model': 'crowd-funding',
            'id': $scope.params.cfid,
            'submodel': 'formality'
        }, function(data) {
            $scope.formality = data;
            var updateDate = moment(data.updated_at);
            var durationArr = [2, 7, 27, 29];
            var durationForeignArr = [2, 7, 107, 109];
            if(data.status >= 2 && data.status <= 6) {
                 $scope.formality.forecast_complete_time = updateDate.add(data.capital_type == 1 ? durationArr[data.status - 2] : durationForeignArr[data.status - 2], 'days').format('YYYY年MM月DD日');
            }
        }, function(err) {
            notify.closeAll();
            ErrorService.alert(err);
        });

        // 身份证审核信息
        $scope.audit = {};
        $scope.loadAuditInfo = function() {
            AuditService['user-identity-card-result'].get(function(data) {
                $scope.audit = data;
                $scope.audit.exist = true;
                $scope.audit.auditPic = data.copies;
            }, function(err) {
                if(err.code == 404) {
                    $scope.audit.exist = false;
                }
            });
        };
        $scope.loadAuditInfo();

        // 提交身份证信息
        $scope.submitForm = function(e) {
            e.preventDefault();
            if(!checkForm('AuditForm')) return;
            AuditService['user-identity-card'].post({
                copies: $scope.audit.auditPic
            }, function(data) {
                $scope.previewMode = false;
                $scope.loadAuditInfo();
                notify.closeAll();
                notify({
                    message: '提交身份证信息成功',
                    classes: 'alert-success'
                });
            }, function(err) {
                notify.closeAll();
                ErrorService.alert(err);
            });
        };

        // 上传扫描件
        $scope.previewMode = false;
        $scope.imgFileSelected = function(files, e) {
            var upyun = window.kr.upyun;
            $scope.previewMode = true;

            if($scope.audit && $scope.audit.status == 3) {
                $scope.audit.reaudit = true;
            }

            for(var i = 0; i < files.length; i++) {
                var file = files[i];
                $scope.progress = 1;

                DefaultService.getUpToken({
                    'x-gmkerl-unsharp': true
                }).then(function(data) {
                    $scope.upload = $upload.upload({
                        url: upyun.api + '/' + upyun.bucket.name,
                        data: data,
                        file: file,
                        withCredentials: false
                    }).progress(function(evt) {
                        $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :' + evt.config.file.name);
                    }).success(function(data, status, headers, config) {
                        var filename = data.url.toLowerCase();
                        if(filename.indexOf('.jpg') != -1 || (filename.indexOf('.png') != -1) || filename.indexOf('.jpeg') != -1) {
                            $scope.previewMode = true;
                            $scope.audit.auditPic = window.kr.upyun.bucket.url + data.url;
                            $scope.audit.exist = true;
                            notify.closeAll();
                            notify({
                                message: '上传身份证扫描件成功',
                                classes: 'alert-success'
                            });
                        } else {
                            ErrorService.alert({
                                msg: '格式不支持，请重新上传！'
                            });
                        }
                        $scope.progress = 0;
                    }).error(function(err) {
                        $scope.progress = 0;
                        if($scope.audit.status !== 3) {
                            $scope.audit.exist = false;
                        }
                        $scope.previewMode = false;
                        $scope.loadAuditInfo();
                        notify.closeAll();
                        notify({
                            message: err,
                            classes: 'alert-danger'
                        });
                    });
                }, function(err) {
                    if($scope.audit.status !== 3) {
                        $scope.audit.exist = false;
                    }
                    $scope.previewMode = false;
                    notify.closeAll();
                    ErrorService.alert(err);
                });
            }
        };

        // Toggle class
        $scope.isActive = false;
        $scope.activeButton = function() {
            $scope.isActive = !$scope.isActive;
        }
    }
]);
