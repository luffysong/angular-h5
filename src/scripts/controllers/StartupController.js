var angular = require('angular');

angular.module('defaultApp.controller').controller('startupController', [
    '$scope', 'StartupService', 'ErrorService', 'UserService', 'CompanyService', '$modal', '$state', 'notify',
    function($scope, StartupService, ErrorService, UserService, CompanyService, $modal, $state, notify) {
        $scope.floors = ['招聘专区', '推广专区', '注册、法务专区', '云服务专区', '创业课专区'];

        /**
         * 查看活动规则
         */
        $scope.seeRules = function() {
            $modal.open({
                templateUrl: 'templates/startup/pop-startup-rules.html',
                windowClass: 'startup-modal',
                controller: [
                    '$scope', '$modalInstance',
                    function($scope, $modalInstance) {
                        $scope.close = function () {
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

        /**
         * 用户信息
         */
        $scope.user = {};
        $scope.user.uid = UserService.getUID();

        /**
         * 创建公司 Url
         */
        $scope.createUrl = '/user/login?from=' + encodeURIComponent(location.protocol + '//' + location.host + '/#/company/create');

        /**
         * 获取服务供应商商品列表
         */
        $scope.getList = function() {
            StartupService['index'].get({

            }, function(res) {
                /* 获取活动时间状态 */
                var startTime = new Date(res.start_time);
                var now = new Date();
                var endTime   = new Date(res.end_time);
                if(now.valueOf() < startTime.valueOf()) {
                    $scope.status = 'before';
                } else if(now.valueOf() > endTime.valueOf()) {
                    $scope.status = 'after';
                } else {
                    $scope.status = 'during';
                }

                /* 活动是否即将结束 */
                if(now.getDate() == endTime.getDate()) {
                    $scope.ending = true;
                }

                $scope.listData = res.list;
            }, function(err) {
                ErrorService.alert(err);
            });
        };

        $scope.getList();

        /**
         * 开抢提醒
         */
        $scope.startRemind = function() {
            if(!$scope.user.uid) {
                $state.go('startupLogin');
            } else {
                StartupService['start-remind'].post({

                }, function(res) {
                    notify({
                        message: res.msg,
                        classes: 'alert-success'
                    });
                    $modal.open({
                        templateUrl: 'templates/startup/pop-startup-remind.html',
                        windowClass: 'startup-modal',
                        controller: [
                            '$scope', '$modalInstance',
                            function($scope, $modalInstance) {
                                $scope.close = function () {
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
                }, function(err) {
                    if(err.msg == '您已设置过开抢提醒') {
                        $modal.open({
                            templateUrl: 'templates/startup/pop-startup-remind.html',
                            windowClass: 'startup-modal',
                            controller: [
                                '$scope', '$modalInstance',
                                function($scope, $modalInstance) {
                                    $scope.startRemindAgain = true;

                                    $scope.close = function () {
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
                    } else {
                        ErrorService.alert(err);
                    }
                });
            }
        };

        /**
         * 点击抢码
         */
        $scope.getCode = function(id) {
            if(!id) return;
            if(!$scope.user.uid) {
                $state.go('startupLogin');
            } else {
                $scope.companyStatus = false;

                /* 判断创建公司状态 */
                CompanyService.getManaged({

                }, function(res) {
                    if(res.code == 0 && res.data) {
                        $scope.companyStatus = !!(res.data.length > 0);
                    }
                }, function(err) {
                    ErrorService.alert(err);
                });

                if(!$scope.companyStatus) {
                    $state.go('startupCompany');
                } else {

                }
            }
        };
    }
]);
