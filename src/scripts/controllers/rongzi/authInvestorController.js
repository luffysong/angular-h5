var angular = require('angular');
angular.module('defaultApp.controller')
  .controller('AuthInvestorController', AuthInvestorController);

function AuthInvestorController($modal, loading, $stateParams, RongziService, $state, UserService, ErrorService, hybrid, FindService, CredentialService) {
    var vm = this;
    vm.needApp = true;
    vm.type = $stateParams.type;
    vm.code = $stateParams.inviteCode;
    vm.verifyInvestor = verifyInvestor;
    vm.isInviteCode = false;
    init();

    function init() {
        initTitle();
        if (!hybrid.isInApp) {
            vm.needApp = false;
        }

        vm.inviteCode = $stateParams.inviteCode;
        initPxLoader();
        isInviteCode();
        loading.hide('findLoading');
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

    function isInviteCode() {
        var uuid = UserService.getUID();
        if (vm.inviteCode && UserService.getUID()) {
            var senddata = {
                code:vm.inviteCode,
                uid:uuid,
            };
            RongziService.isInviteCode(senddata)
                .then(function setUserData(data) {
                    vm.isInviteCode = data.data.data;
                }).catch(fail);
        }
    }

    function initUserData() {
        FindService.getUserProfile()
            .then(function setUserData(data) {
                vm.investorState = data.data.investor;
            }).catch(fail);
    }

    function initTitle(t) {
        document.title = '融资季 · 邀请认证投资人';
    }

    function fail(err) {
        ErrorService.alert(err.msg);
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
