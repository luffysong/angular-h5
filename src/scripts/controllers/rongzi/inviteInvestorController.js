var angular = require('angular');
angular.module('defaultApp.controller')
  .controller('InviteInvestorController', InviteInvestorController);

function InviteInvestorController($modal, loading, $stateParams, RongziService, $state, UserService, ErrorService, hybrid) {
    var vm = this;
    vm.needApp = true;
    vm.openApp = openApp;
    vm.type = $stateParams.type;
    vm.inviteAction = inviteAction;
    init();

    function init() {
        initTitle();
        outInitLinkme();
        getInviteCode();
        getInviteCount();
        if (!hybrid.isInApp) {
            outInitLinkme();
            vm.needApp = false;
        }

        initPxLoader();
        loading.hide('findLoading');
        vm.inviteCode = '45w2';
        vm.inviteCount = 2;
    }

    function getInviteCode() {
        RongziService.getRecCode()
        .then(function (response){
            console.log(response);
            // vm.inviteCode = response.code;
        }).catch(fail);
    }

    function getInviteCount() {
        RongziService.getRecCount()
        .then(function (response){
            console.log(response);
            // vm.inviteCount = response.data.count;
        });
    }

    function initWeixin(name, desc) {
        window.WEIXINSHARE = {
            shareTitle: '邀请认证投资人得特权',
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

    function initTitle(t) {
        document.title = '融资季 · 邀请认证投资人';
    }

    function fail(err) {
        ErrorService.alert(err.err.msg);
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

    function inviteAction() {
        $state.go('rongzi.authInvestor', { type: 'orange' });
    }
}
