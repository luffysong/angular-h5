var angular = require('angular');
angular.module('defaultApp.controller')
  .controller('EnrollController', EnrollController);

function EnrollController(loading, $stateParams, RongziService, $state, UserService, ErrorService, $modal, hybrid) {
    var vm = this;
    vm.projectList = [];
    vm.enrollEvent = enrollEvent;
    vm.isLogin = false;
    vm.needApp = true;
    vm.modalOpen = modalOpen;
    vm.openApp = openApp;
    vm.openAppUrl;
    init();
    function init() {
        initTitle();
        initWeixin();
        loading.hide('findLoading');
        initData();
        if (UserService.getUID()) {
            vm.isLogin = true;
        }

        if (!hybrid.isInApp) {
            initLinkmeInvestor();
            vm.needApp = false;
        }

        initPxLoader();
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
        RongziService.getManagedProjects()
            .then(function (response) {
                vm.projectList = response.data.data;
            }).catch(fail);
    }

    function initWeixin() {
        window.WEIXINSHARE = {
            shareTitle: '【创投助手·融资季】参加即可上榜！让每一个好项目都不被辜负。',
            shareUrl: window.location.href,
            shareImg: 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png',
            shareDesc: '每日24：00更新当日对接最火热三甲，数万投资人同行帮你甄选，你离好项目只差一步！',
        };

        var obj = {};
        window.InitWeixin(obj);
    }

    function enrollEvent(ccid) {
        vm.modalOpen();

        params = {
            ccid: ccid
        };
        RongziService.enroll(params)
            .then(function (response) {
                console.log(ccid);
                angular.forEach(vm.projectList, function (o) {
                    if (o.ccid === ccid) {
                        console.log(o);
                        o.projectId = response.data.projectId;
                        o.applied = true;
                    }
                });
            }).catch(fail);
    }

    function modalOpen() {
        var info = {
            title: '已报名成功！',
            content: '点击查看分享页，可分享给好友为你点赞！'
        };
        $modal.open({
            templateUrl: 'templates/rongzi-common/enrollMessage.html',
            windowClass: 'nativeAlert_wrap',
            controller: modalController,
            controllerAs: 'vm',
            resolve: {
                obj: function () {
                    return info;
                }
            }
        });
    }

    modalController.$inject = ['$modalInstance', 'obj'];
    function modalController($modalInstance, obj) {
        var vm = this;
        vm.title = obj.title;
        vm.content = obj.content;
        vm.cancelModal = cancelModal;

        function cancelModal() {
            $modalInstance.dismiss();
        }

    }

    function initTitle(t) {
        document.title = '融资季 · 我要报名';
    }

    function fail(err) {
        ErrorService.alert(err.err.msg);
    }

    function openApp() {
        if (!hybrid.isInApp) {
            defaultModal();
        } else if (hybrid.isInApp && !UserService.getUID()) {
            window.location.href = 'https://passport.36kr.com/pages';
        }else {
            hybrid.open('signUp');
        }
    }

    function initLinkmeInvestor() {
        var krdata = {};
        krdata.type =  window.projectEnvConfig.linkmeType;
        krdata.params =
        '{"openlink":"https://' + window.projectEnvConfig.rongHost + '/m/#/rongzi/enroll","currentRoom":"1"}';
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
                            vm.openAppUrl = data.url;
                        }
                    }, false);
            });
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
