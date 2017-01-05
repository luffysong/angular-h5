var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('startUpController', startUpController);

function startUpController($stateParams, checkForm, ActivityService,
    $state, UserService, ErrorService, $scope, FindService) {
    var vm = this;
    vm.activityName = $stateParams.activityName;
    vm.submitForm = submitForm;
    $scope.hasClick = false;
    vm.startup = {
        actId: $stateParams.activityName,
        projectIntro: '',
        projectName: '',
        realName: ''
    };

    /*错误信息提示*/
    $scope.error = {
        code:0, //0为不显示，非0显示错误信息
        msg:''
    };

    initUser();

    //先查看是否登录 在查看是否参加活动
    function initUser() {
        if (!UserService.getUID()) {
            $state.go('findLogin', {
                activityName: vm.activityName,
                type: 'starup'
            });
        } else {
            startUpState();
        }
    }

    function startUpState() {
        ActivityService.startUpState(vm.activityName)
            .then(function (response) {
                if (!response.data.applied) {
                    FindService.getUserProfile()
                        .then(function (data) {
                            console.log('999999', data);
                        })
                        .catch(error);
                } else {
                    $state.go('findStartUpSuccess', {
                        activityName: vm.activityName
                    });
                }
            })
            .catch(error);
    }

    var Error = {
        show: function (msg) {
            $scope.error.msg = msg;
            $scope.error.code = 1;
        },

        hide: function () {
            $scope.error.code = 0;
        }
    };

    function submitForm() {
        if (!vm.startup.realName) {
            ErrorService.alert('姓名必填');
            return;
        }

        if (!vm.startup.projectName) {
            ErrorService.alert('项目名称');
            return;
        }

        if (!vm.startup.projectIntro) {
            ErrorService.alert('项目简介');
            return;
        }

        ActivityService.startUpSignUp(vm.startup)
            .then(function success() {
                $state.go('findStartUpSuccess', {
                    activityName: $scope.activityName
                });
            })
            .catch(error);
    }

    function error(err) {
        ErrorService.alert(err);
    }
}
