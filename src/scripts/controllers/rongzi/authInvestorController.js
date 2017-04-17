var angular = require('angular');
angular.module('defaultApp.controller')
  .controller('AuthInvestorController', AuthInvestorController);

function AuthInvestorController($modal, loading, $stateParams, RongziService, $state, UserService, ErrorService, hybrid, FindService, CredentialService) {
    var vm = this;
    vm.needApp = true;
    vm.openApp = openApp;
    vm.type = $stateParams.type;
    vm.code = $stateParams.inviteCode;
    vm.verifyInvestor = verifyInvestor;
    init();

    function init() {
        initTitle();
        outInitLinkme();
        if (!hybrid.isInApp) {
            outInitLinkme();
            vm.needApp = false;
        }

        vm.inviteCode = $stateParams.inviteCode;
        initPxLoader();
        loading.hide('findLoading');
        initUserData();
    }

    function initWeixin() {
        window.WEIXINSHARE = {
            shareTitle: '邀你共度神秘八小时！ ',
            shareUrl: window.location.href,
            shareImg: 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png',
            shareDesc: '偷偷告诉你，这是顶级机构的省时法宝，你也来试试！',
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

    function initUserData() {
        FindService.getUserProfile()
            .then(function setUserData(data) {
                vm.investorState = data.data.investor;
            }).catch(fail);
    }

    function initTitle(t) {
        document.title = '融资季 · 创业项目号召力榜';
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

    function verifyInvestor() {
        if (!UserService.getUID() && !hybrid.isInApp) {
            CredentialService.directToLoginSimple();
        } else if (hybrid.isInApp && !UserService.getUID()) {
            window.location.href = 'https://passport.36kr.com/pages';
        } else {
            $state.go('investorValidateApply', { inviteCode: vm.code });
        }
    }
}
