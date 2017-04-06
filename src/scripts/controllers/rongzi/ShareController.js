var angular = require('angular');
angular.module('defaultApp.controller')
  .controller('ShareController', ShareController);

function ShareController($modal, loading, $stateParams, RongziService, $state, UserService, ErrorService, hybrid, projectInfo) {
    var vm = this;
    vm.project = [];
    vm.liked = false;
    vm.like = like;
    vm.share = share;
    vm.needApp = true;
    vm.openApp = openApp;
    init();

    function init() {
        initTitle();
        outInitLinkme();
        initData();
        if (!hybrid.isInApp) {
            outInitLinkme();
            vm.needApp = false;
        }

        initPxLoader();
        loading.hide('findLoading');
    }

    function initWeixin(name, desc) {
        window.WEIXINSHARE = {
            shareTitle: '【创投助手·融资季】' + name + '正在参与最有号召力创业项目评选，请投我一票！',
            shareUrl: window.location.href,
            shareImg: 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png',
            shareDesc: '' + desc,
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
        vm.project = projectInfo.data;
        if (vm.project.name && vm.project.intro) {
            initWeixin(vm.project.name, vm.project.intro);
        }
    }

    function initTitle(t) {
        document.title = '融资季 · 创业项目号召力榜';
    }

    function fail(err) {
        ErrorService.alert(err.err.msg);
    }

    function like(id) {
        if (!hybrid.isInApp) {
            //window.location.href = vm.openUrl;
            defaultModal();
        } else if (!UserService.getUID()) {
            window.location.href = 'https://passport.36kr.com/pages';
        } else if (UserService.getUID() && hybrid.isInApp) {
            RongziService.like(id)
                .then(function (response) {
                    vm.project.likes = response.data.curCount;
                    vm.project.liked = true;
                });
        }
    }

    function share() {
        // if (!hybrid.isInApp) {
        //     window.location.href = vm.openUrl;
        // }
        defaultModal();
    }

    function outInitLinkme() {
        var krdata = {};
        krdata.type =  window.projectEnvConfig.linkmeType;
        krdata.params =
        '{"openlink":"https://' + window.projectEnvConfig.rongHost + '/m/#/rongzi/share?id=' + $stateParams.id + '","currentRoom":"0"}';

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
                            vm.openUrl = data.url;
                        }
                    }, false);
            });
    }

    function defaultModal(item) {
        item = item ? item : {};
        item.openUrl = vm.openUrl;
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

    function openApp() {
        if (!hybrid.isInApp) {
            defaultModal();
        }else {
            hybrid.open('crmCompany/' + vm.project.ccid);
        }
    }
}
