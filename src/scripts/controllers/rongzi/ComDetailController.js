var angular = require('angular');
angular.module('defaultApp.controller')
  .controller('ComDetailController', ComDetailController);

function ComDetailController($modal, loading, $stateParams, RongziService, $state, UserService, ErrorService, hybrid) {
    var vm = this;
    vm.tabChange = tabChange;
    vm.shareWechat = shareWechat;
    vm.Aafter = false;
    vm.Abefore = true;
    vm.category = $stateParams.category;
    vm.state = $stateParams.state;
    vm.nameArr = [];
    vm.subscribe = subscribe;
    vm.needApp = true;
    vm.hasEmail = false;
    vm.openApp = openApp;
    vm.openAppUrl;
    init();

    function init() {
        loading.hide('findLoading');
        initData();
        if (!hybrid.isInApp) {
            initLinkme();
            vm.needApp = false;
        }

        initWeixin();
    }

    function tabChange(e) {
        var obj = angular.element(e.currentTarget);
        var id = obj.attr('id');
        obj.parent().children().removeClass('tab-org-selected');
        obj.addClass('tab-org-selected');
        if ('AAfter' === id) {
            vm.Aafter = true;
            vm.Abefore = false;
        } else if (('ABefore') === id) {
            vm.Aafter = false;
            vm.Abefore = true;
        }
    }

    function initWeixin() {
        window.WEIXINSHARE = {
            shareTitle: '【创投助手·融资季】' + $stateParams.name + '优质项目输出，提前来对接！',
            shareUrl: window.location.href,
            krtou: 'weChatShare/' + $stateParams.id,
            shareImg: 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png',
            shareDesc: '每周2个创业社群精品项目选送，等你来约谈。',
        };

        var obj = {};
        window.InitWeixin(obj);
    }

    function initData() {
        if (parseInt($stateParams.id)) {
            RongziService.getBaseInfo($stateParams.id)
                .then(function setDetail(data) {
                        if (data.data) {
                            vm.result = data.data;
                            vm.name = data.data.name;

                            initTitle('融资季·' + data.data.name);
                            vm.nameArr = vm.name.split('');
                        }
                    }).catch(fail);
        }

        if (UserService.getUID()) {
            RongziService.getProjectList($stateParams.id)
                .then(function (data) {
                    if (data.data.projects) {
                        vm.associations = data.data.projects.associations;
                    }

                    vm.canWeChatShare = data.data.canWeChatShare;
                    vm.hasPermission = data.data.hasPermission;
                    vm.remind = data.data.remind;
                }).catch(fail);
        }
    }

    function initTitle(t) {
        document.title = t;
    }

    function fail(err) {
        if (err.code === '403') {
            console.log(err.msg);
        } else if (err.code === '1') {
            ErrorService.alert(err.msg);
        }
    }

    function subscribe(item, e) {
        e.preventDefault();
        e.stopPropagation();
        item = item ? item : {};
        item.investRole = vm.investRole;
        item.hasEmail = vm.hasEmail;
        if (!hybrid.isInApp) {
            defaultModal();
        }else if (hybrid.isInApp && vm.remind === 1 && UserService.getUID()) {
            subscribeAction(item);
        }else if (UserService.getUID() && vm.remind === 0 && UserService.getUID()) {
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
            subscibeType:1,
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
            id:vm.result.id,
            subscibeType:1,
        };
        RongziService.cancelSubscribe(senddata)
        .then(function setSussess() {
            item.cancelMainRemind = true;
            item.title = '取消开场提醒成功！';
            item.hasEmail = true;
            item.cancelRemindtxt = '后续新上的' + $stateParams.name + '将不会有专场提醒，现已有排期的专场仍会提醒！';
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

    function openApp(ccid) {
        if (!hybrid.isInApp) {
            defaultModal();
        } else if (hybrid.isInApp && UserService.getUID() && ccid) {
            hybrid.open('crmCompany/' + ccid);
        }

    }

    function defaultModal(item) {
        item = item ? item : {};
        item.openUrl = vm.openAppUrl;
        $modal.open({
            templateUrl: 'templates/rongzi-common/downloadApp.html',
            windowClass: 'nativeAlert_wrap',
            controller: defaultController,
            controllerAs: 'vm',
            resolve: {
                obj: function () {
                    return item;
                }
            }
        });
    }

    defaultController.$inject = ['$modalInstance', 'obj'];
    function defaultController($modalInstance, obj) {

        var vm = this;
        vm.openUrl = obj.openUrl;
        vm.cancelModal = cancelModal;

        function cancelModal() {
            $modalInstance.dismiss();
        }
    }

    function initLinkme() {
        var krdata = {};
        krdata.type =  window.projectEnvConfig.linkmeType;
        krdata.params =
        '{"openlink":"https://' + window.projectEnvConfig.rongHost + '/m/#/rongzi/comdetail?id=' + $stateParams.id + '&category=' + $stateParams.category + '","currentRoom":"0"}';
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
                        }
                    }, false);
            });
    }

    function shareWechat() {
        if (!hybrid.isInApp) {
            defaultModal();
        }else if (hybrid.isInApp && !UserService.getUID()) {
            window.location.href = 'https://passport.36kr.com/pages';
        } else if (hybrid.isInApp && UserService.getUID()) {
            hybrid.open('weChatShare/' + $stateParams.id);
        }
    }
}
