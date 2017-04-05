var angular = require('angular');
angular.module('defaultApp.controller')
  .controller('CommunityController', CommunityController);

function CommunityController($document, $timeout, $scope, $modal, loading, $stateParams,
  RongziService, FindService, $state, UserService, ErrorService, hybrid) {
    var vm = this;
    vm.subscribe = subscribe;
    vm.needApp = true;
    vm.investRole = false;
    vm.hasEmail = false;
    vm.openApp = openApp;
    vm.openAppUrl;

    init();
    function init() {
        if (!hybrid.isInApp) {
            initLinkmeComm();
            vm.needApp = false;
        }

        loading.hide('findLoading');
        initUser();
        initData();
        initWeixin();
        initPxLoader();
    }

    function initWeixin() {
        window.WEIXINSHARE = {
            shareTitle: '【创投助手·融资季】创业圈“黄埔军校”输出，为认可的创业基因助威。',
            shareUrl: window.location.href,
            shareImg: 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png',
            shareDesc: '每周2个创业者社群精品项目选送，名企名校类及其他社群类，快来对接项目！',
        };

        var obj = {};
        window.InitWeixin(obj);
    }

    function removeHeader() {
        $('.common-header.J_commonHeaderWrapper').remove();
    }

    function initPxLoader() {
        var loader = new PxLoader();
        var imgArr = document.getElementsByTagName('img');
        for (var i = 0; i < imgArr.length; i++) {
            console.log('====', imgArr[i].src);
            var pxImage = new PxLoaderImage(imgArr[i].src);
            pxImage.imageNumber = i + 1;
            loader.add(pxImage);
        }

        loader.start();
    }

    function initData() {
        RongziService.getCommunity({ id: $stateParams.id })
            .then(function setCommunity(data) {
                    if (data.data) {
                        vm.result = data.data.data;
                        vm.remind = vm.result.remind;
                        vm.corUni = [];
                        vm.other = [];
                        angular.forEach(data.data.data.sessions,
                          function (dt, index, array) {
                            if (dt.projectCategory === 1) {
                                vm.other.push(dt);
                            } else if (dt.projectCategory === 0) {
                                vm.corUni.push(dt);
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
        document.title = '融资季 · 创业社群专场';
    }

    function fail(err) {
        ErrorService.alert(err.err.msg);
    }

    function initLinkmeComm() {
        var krdata = {};
        krdata.type = 'test';
        krdata.params =
        '{"openlink":"https://' + window.projectEnvConfig.rongHost + '/m/#/rongzi/community?id=' + $stateParams.id + '","currentRoom":"0"}';
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
            //document.location.href = vm.openAppUrl;
            defaultModal();
        } else if (hybrid.isInApp && vm.result.remind === 1 && UserService.getUID()) {
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
            item.cancelRemindtxt = '后续新上的社群专场将不会有专场提醒，现已有排期的专场仍会提醒！';
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
        // if (!hybrid.isInApp) {
        //     window.location.href = vm.openAppUrl;
        // }
        defaultModal();
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
}
