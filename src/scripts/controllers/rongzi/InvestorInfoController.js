var angular = require('angular');
angular.module('defaultApp.controller')
  .controller('InvestorInfoController', InvestorInfoController);

function InvestorInfoController(loading, $scope, $modal, $stateParams, RongziService, $state, UserService, ErrorService, FindService, hybrid) {
    var vm = this;
    vm.subscribe = subscribe;
    vm.needApp = true;
    vm.investRole = false;
    vm.hasEmail = false;
    vm.openApp = openApp;
    vm.openAppUrl;
    vm.page = 0;
    vm.more = false;
    vm.displayMore = displayMore;
    vm.investors = [];
    vm.names = [];
    vm.noData = true;
    vm.shareWechat = shareWechat;
    vm.downloadMask = downloadMask;
    init();

    function init() {
        if (!hybrid.isInApp) {
            initLinkmeInvestor();
            vm.needApp = false;
        }

        initData();
        initUser();
        initPxLoader();
        vm.state = $stateParams.state;
        loading.hide('findLoading');
    }

    function initWeixin(name) {
        window.WEIXINSHARE = {
            shareTitle: '【创投助手·融资季】明星投资人' + name + '独家项目集，等你来掐尖儿。',
            shareUrl: window.location.href,
            krtou: 'weChatShare/' + $stateParams.id,
            shareImg: 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png',
            shareDesc: '明星携被投项目加入，每周二、三更新两场。',
        };

        var obj = {};
        window.InitWeixin(obj);
    }

    function initPxLoader() {
        var loader = new PxLoader();
        var imgArr = document.getElementsByTagName('img');
        for (var i = 0; i < imgArr.length; i++) {
            var pxImage = new PxLoaderImage(imgArr[i].src);
            pxImage.imageNumber = i + 1;
            loader.add(pxImage);
        }

        loader.start();
    }

    function initData() {
        RongziService.getBaseInfo($stateParams.id)
            .then(function (data) {
                    if (data.data) {
                        vm.result = data.data;
                        vm.name = data.data.name;
                        vm.status = vm.result.status;
                        initWeixin(vm.name);
                        vm.names = data.data.name.split('');
                        initTitle('融资季·' + data.data.name);
                    }
                }).catch(fail);
        if (UserService.getUID()) {
            RongziService.getProjectList($stateParams.id)
                .then(function (data) {
                    if (data.data.projects) {
                        vm.projects = data.data.projects;
                        vm.noData = false;
                    }

                    vm.canWeChatShare = data.data.canWeChatShare;
                    vm.hasPermission = data.data.hasPermission;
                    vm.remind = data.data.remind;
                }).catch(fail);
        }
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

    function initLinkmeInvestor() {
        var krdata = {};
        krdata.type =  window.projectEnvConfig.linkmeType;
        krdata.params =
        '{"openlink":"https://' + window.projectEnvConfig.rongHost + '/m/#/rongzi/investorInfo?id=' + $stateParams.id + '&category=' + $stateParams.category + '","currentRoom":"0"}';
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
        item.remindText = vm.name;
        if (!hybrid.isInApp) {
            defaultModal();
        }else if (hybrid.isInApp && vm.remind === 1 && UserService.getUID()) {
            subscribeAction(item);
        }else if (UserService.getUID() && vm.remind === 0) {
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
        vm.setEmailState = false;
        vm.addEmail = addEmail;
        vm.remindText = obj.remindText;

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
                    vm.cancelRemindtxt = '当' + vm.remindText + '专场开始时，您将会收到包括邮件在内的所有提醒，' +
                       '确保您不会错过本专场';
                    vm.setEmailState = true;
                    vm.hasEmail = true;
                })
              .catch(fail);
            } else {
                $modalInstance.dismiss();
            }
        }
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

    function subscribeAction(item) {
        var senddata = {
            id:vm.result.id,
            subscibeType: 1,
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
            item.cancelRemindtxt = '本专场开始前不会有开场提醒！';
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

    function displayMore() {
        initData();
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

    function shareWechat() {
        if (!hybrid.isInApp) {
            defaultModal();
        }else if (hybrid.isInApp && !UserService.getUID()) {
            window.location.href = 'https://passport.36kr.com/pages';
        } else if (hybrid.isInApp && UserService.getUID()) {
            hybrid.open('weChatShare/' + $stateParams.id);
        }
    }

    function downloadMask() {
        window.location.href = vm.openAppUrl;
    }

}
