var angular = require('angular');

angular.module('defaultApp.controller').controller('startupController', [
    '$scope', 'StartupService', 'ErrorService', 'UserService', 'CompanyService', '$modal', '$state',
    function($scope, StartupService, ErrorService, UserService, CompanyService, $modal, $state) {
        $scope.floors = ['招聘专区', '推广专区', '注册、法务专区', '云服务专区', '创业课专区'];

        /**
         * 查看活动规则
         */
        $scope.seeRules = function() {
            $modal.open({
                templateUrl: 'templates/startup/pop-startup-rules.html',
                windowClass: 'startup-rules',
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
         * 获取活动时间状态
         */
        var startTime = (new Date('2015-08-20 10:00')).valueOf();
        var now = (new Date()).valueOf();
        var endTime = (new Date('2015-08-25 17:00')).valueOf();

        if(now < startTime) {
            $scope.status = 'during';
        } else if(now > endTime) {
            $scope.status = 'after';
        } else {
            $scope.status = 'during';
        }

        /**
         * 获取服务供应商商品列表
         */
        $scope.getList = function() {
            StartupService['index'].get({

            }, {

            }, function(res) {
                console.log(res);
                $scope.listData = res;
            }, function(err) {
                ErrorService.alert(err.msg);
            });
        };

        $scope.getList();

        /**
         * 开抢提醒
         */
        $scope.startRemind = function() {
            StartupService['start-remind'].post({

            }, {
                'product_id': 1
            }, function(res) {
                if(res.code == 0) {
                    console.log(res);
                } else {
                    ErrorService.alert(res.msg);
                }
            }, function(err) {
                ErrorService.alert(err.msg);
            });
        };

        /**
         * 获取token
         */
        StartupService['qr-code-token'].get({

        }, {
            'product_id': 1
        }, function(res) {
            console.log(res);
        }, function(err) {
            ErrorService.alert(err.msg);
        });

        /**
         * 点击抢码
         */
        $scope.getCode = function(id, type) {
            if(!$scope.user.uid) {
                $state.go('startupLogin');
            } else {
                CompanyService.getManaged({

                }, function(res) {
                    console.log(res);
                }, function(err) {
                    ErrorService.alert(err);
                });

                if (true) {
                    $state.go('startupCompany');
                }
            }
        };
    }
]);
