var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('FrStartUpController', FrStartUpController);

function FrStartUpController($stateParams, checkForm, ActivityService,
    $state, UserService, ErrorService, $scope, FindService) {
    var vm = this;
    vm.activityName = $stateParams.activityName;
    $scope.hasClick = false;
    vm.startup = {
        actId: $stateParams.activityName,
        projectIntro: '',
        projectName: '',
        realName: ''
    };
    vm.bothh3 = false;
    vm.investorh3 = false;
    vm.startuph3 = false;

    /*错误信息提示*/
    $scope.error = {
        code:0, //0为不显示，非0显示错误信息
        msg:''
    };

    initUser();

    //先查看是否登录 再查看是否参加活动
    function initUser() {
        vm.startup.actId = $stateParams.activityName;
        $scope.user = {
            id: UserService.getUID(),
        };
        if (!UserService.getUID()) {
            $state.go('findLogin', {
                activityName: vm.activityName,
                type: 'startup'
            });
        } else {
            startUpState();
        }

        $('html').css('overflow', 'auto');
        $('body').css('overflow', 'auto');
        initH3();
    }

    function startUpState() {
        ActivityService.startUpState(vm.activityName)
            .then(function (response) {
                if (!response.data.applied) {
                    FindService.getUserProfile()
                        .then(function (response) {
                            vm.startup.realName = response.data.name;
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

    $scope.submitBtn = function () {
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

        $scope.user.name = vm.startup.realName;

        UserService.basic.update({
                id: $scope.user.id
            }, {
                name: $scope.user.name,
            }).$promise.then(setActivity)
            .catch(function (err) {
                $scope.hasClick = false;
                ErrorService.alert({
                    msg: err.msg
                });
            });
    };

    function setActivity() {
        ActivityService.startUpSignUp(vm.startup)
            .then(function success() {
                $state.go('findStartUpSuccess', {
                    activityName: $scope.activityName
                });
            })
            .catch(error);
    }

    function error(err) {
        $scope.hasClick = false;
        ErrorService.alert(err);
    }

    function initH3() {
        if (document.applierType) {
            vm[document.applierType.toLowerCase() + 'h3'] = true;
        }
    }
}
