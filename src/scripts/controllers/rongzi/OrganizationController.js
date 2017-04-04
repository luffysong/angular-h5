var angular = require('angular');
angular.module('defaultApp.controller')
  .controller('OrganizationController', OrganizationController);

function OrganizationController(loading, $scope, $modal, $stateParams, RongziService, $state, UserService, ErrorService, FindService, hybrid) {
    var vm = this;
    vm.subscribe = subscribe;
    vm.needApp = true;
    vm.investRole = false;
    vm.hasEmail = false;
    vm.openApp = openApp;
    vm.openAppUrl;
    init();
    function init() {
        loading.hide('findLoading');
        removeHeader();
        initLinkmeInvestor();
        initData();
        initUser();
    }

    function initData() {
        RongziService.getOrg({ id: $stateParams.id })
            .then(function setCommunity(data) {
                    if (data.data) {
                        vm.result = data.data.data;
                        vm.beforeA = [];
                        vm.afterA = [];

                        angular.forEach(data.data.data.sessions,
                          function (dt, index, array) {
                            if (dt.projectCategory === 1) {
                                vm.afterA.push(dt);
                            } else if (dt.projectCategory === 0) {
                                vm.beforeA.push(dt);
                            }
                        });

                        initTitle(vm.result.title);
                    }
                }).catch(fail);

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

    function initTitle(t) {
        document.title = t;
    }

    function fail(err) {
        ErrorService.alert(err.err.msg);
    }

    function removeHeader() {
        $('.common-header.J_commonHeaderWrapper').remove();
    }

    function initLinkmeInvestor() {
        var krdata = {};
        krdata.type = 'test';
        krdata.params =
        '{"openlink":"https://' + window.projectEnvConfig.rongHost + '/m/#/rongzi/investor?id=' + $stateParams.id + '","currentRoom":"0"}';
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
                            //console.log(data.url,   $('#comm-openApp11').attr('href'));
                            vm.openAppUrl = data.url;
                            $('#comm-openApp').attr('href', data.url);
                        }
                    }, false);
            });
    }

    function subscribe(item, e) {
        e.preventDefault();
        e.stopPropagation();
        item = item ? item : {};
        item.investRole = vm.investRole;
        item.hasEmail = vm.hasEmail;
        if (!hybrid.isInApp) {
            document.location.href = vm.openAppUrl;
        }else if (hybrid.isInApp && vm.result.remind === 1 && UserService.getUID()) {
            subscribeAction(item);
        }else if (UserService.getUID() && vm.result.remind === 0 && UserService.getUID()) {
            cancelSubscribeAction(item);
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
                email: vm.emailInput,
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
            id:vm.result.id,
            category:vm.result.category,
            subscibeType:0,
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
            vm.result.remind = 0;
        })
        .catch(fail);
    }

    function cancelSubscribeAction(item) {
        var senddata = {
            id:vm.result.id,
            category:vm.result.category,
            subscibeType:0,
        };
        RongziService.cancelSubscribe(senddata)
        .then(function setSussess() {
            item.cancelMainRemind = true;
            item.title = '取消开场提醒成功！';
            item.hasEmail = true;
            item.cancelRemindtxt = '后续新上的顶级机构专场将不会有专场提醒，现已有排期的专场仍会提醒！';
            modalOpen(item);
            vm.result.remind = 1;
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

    function openApp() {
        if (!hybrid.isInApp) {
            window.location.href = vm.openAppUrl;
        }
    }

}
