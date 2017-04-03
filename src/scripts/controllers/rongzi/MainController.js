
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('MainController', MainController);

function MainController(loading, $scope, $modal, $stateParams, FindService,
    $state, UserService, RongziService, ErrorService, hybrid) {
    var vm = this;
    vm.subscribe = subscribe;
    vm.needApp = true;
    vm.investRole = false;
    vm.hasEmail = false;
    init();

    function init() {
        initData();
        loading.show('findLoading');
        removeHeader();
        initTitle();
        initUser();
        if (!hybrid.isInApp) {
            initLinkme();
            vm.needApp = false;
        }
    }

    function initTitle() {
        document.title = '创投助手 · 融资季';
    }

    function removeHeader() {
        $('.common-header.J_commonHeaderWrapper').remove();
    }

    window.initCss = function () {
        $('#activityInfoFirst').hide();
    };

    window.initCss();
    if (!UserService.getUID()) {
        window.initCss();
    }

    function initUser() {
        FindService.getUserProfile()
            .then(function temp(response) {
                if (response.data) {
                    if (response.data.investor) {
                        vm.investRole = true;
                    }

                    // if (response.data.commonEmail) {
                    //     vm.hasEmail = true;
                    // }
                }
            });
    }

    function subscribe(item, e) {
        e.preventDefault();
        e.stopPropagation();
        item = item ? item : {};
        item.investRole = vm.investRole;
        item.hasEmail = vm.hasEmail;
        if (UserService.getUID()) {
            if (vm.remind === 1) {
                subscribeAction(item);
            }else {
                cancelSubscribeAction(item);
            }
        } else {
            window.location.href = 'https://passport.36kr.com/pages';
        }
    }

    modalController.$inject = ['$modalInstance', 'obj', 'hybrid'];
    function modalController($modalInstance, obj, hybrid) {

        var vm = this;
        vm.item = obj;
        vm.cancelModal = cancelModal;
        vm.needApp = true;
        vm.title = obj.title;
        vm.investRole = obj.investRole;
        vm.hasEmail = obj.hasEmail;
        vm.cancelMainRemind = obj.cancelMainRemind;
        vm.cancelRemindtxt = obj.cancelRemindtxt;
        vm.needApp = true;
        vm.setEmailState = false;
        vm.addEmail = addEmail;

        function cancelModal() {
            $modalInstance.dismiss();
        }

        function addEmail() {
            var senddata = {
                email: vm.emailInput + '',
            };
            if (vm.emailInput) {
                RongziService.setEmail(senddata)
                .then(function setSussess() {
                    vm.title = '添加邮件提醒成功！';
                    vm.setEmailState = true;
                    vm.hasEmail = true;
                })
                .catch(fail);
            } else {
                $modalInstance.dismiss();
            }
        }
    }

    function subscribeAction(item) {
        var senddata = {
            subscibeType:-1,
        };
        RongziService.setSubscribe(senddata)
        .then(function setSussess(data) {
            if (data.data.data) {
                vm.hasEmail = true;
            }

            item.hasEmail = vm.hasEmail;
            item.cancelMainRemind = false;
            item.title = '设置开场提醒成功！';
            modalOpen(item);
            vm.remind = 0;
        })
        .catch(fail);
    }

    function cancelSubscribeAction(item) {
        var senddata = {
            subscibeType:-1,
        };
        RongziService.cancelSubscribe(senddata)
        .then(function setSussess() {
            item.cancelMainRemind = true;
            item.hasEmail = true;
            item.title = '取消开场提醒成功！';
            item.cancelRemindtxt = '后续新上的所有专场将不会有专场提醒，现已有排期的专场仍会提醒！';
            modalOpen(item);
            vm.remind = 1;
        })
        .catch(fail);
    }

    function modalOpen(item) {
        $modal.open({
            templateUrl: 'templates/rongzi-common/remindAlert.html',
            windowClass: 'nativeAlert_wrap',
            controller: modalController,
            controllerAs: 'vm',
            resolve: {
                obj: function () {
                    return item;
                }
            }
        });
    }

    $scope.$watch('$viewContentLoaded', function () {
        loading.hide('findLoading');
    });

    function initData() {
        RongziService.getHome()
            .then(function setHomeData(data) {
                    if (data.data) {
                        vm.result = data.data.data;
                        vm.remind = data.data.data.remind;
                        vm.starList = data.data.data.startupProjectVoList;
                        if (vm.result.sessionCustomVoList) {
                            if (vm.result.sessionCustomVoList.length > 0) {
                                angular.forEach(vm.result.sessionCustomVoList,
                                  function (dt, index, array) {
                                    if (dt.category === -1) {
                                        vm.org = dt;
                                    } else if (dt.category === 0) {
                                        vm.community = dt;
                                    } else {
                                        vm.investor = dt;
                                    }
                                });
                            }
                        }
                    }
                }).catch(fail);
    }

    function initLinkme(params) {
        var krdata = {};
        krdata.type = 'test';
        krdata.params =
        '{"openlink":"https://' + window.projectEnvConfig.rongHost + '/m/#/rongzi/main","currentRoom":"1"}';
        window.linkedme.init(window.projectEnvConfig.linkmeKey,
        { type: window.projectEnvConfig.linkmeType }, function (err, res) {
                if (err) {
                    return;
                }

                window.linkedme.link(krdata, function (err, data) {
                        if (err) {
                            // 生成深度链接失败，返回错误对象err
                            console.log(err);
                        } else {
                            // 生成深度链接成功，深度链接可以通过data.url得到
                            $('#main-open').attr('href', data.url);
                        }
                    }, false);
            });
    }

    function fail(err) {
        ErrorService.alert(err.err.msg);
    }
}
