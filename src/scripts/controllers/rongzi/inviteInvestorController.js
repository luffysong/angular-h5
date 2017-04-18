var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('InviteInvestorController', InviteInvestorController);

function InviteInvestorController($modal, loading, $stateParams, RongziService, $state, UserService, ErrorService, hybrid, CredentialService) {
    var vm = this;
    vm.needApp = true;
    vm.type = $stateParams.type;
    vm.inviteAction = inviteAction;
    init();

    function init() {
        initTitle();
        getInviteCode();
        getInviteCount();
        initWeixin();
        initUser();
        if (!hybrid.isInApp) {
            vm.needApp = false;
        }

        initPxLoader();
        loading.hide('findLoading');
        getType();
    }

    function initUser() {
        if (!UserService.getUID() && !hybrid.isInApp) {
            CredentialService.directToLoginSimple();
        } else if (hybrid.isInApp && !UserService.getUID()) {
            window.location.href = 'https://passport.36kr.com/pages';
        }
    }

    function getInviteCode() {
        RongziService.getRecCode()
            .then(function(response) {
                vm.inviteCode = response.data.code;
            }).catch(fail);
    }

    function getInviteCount() {
        RongziService.getRecCount()
            .then(function(response) {
                vm.inviteCount = response.data.count;
            });
    }

    function getType() {
        if ($stateParams.category < 0) {
            vm.type = 'orange';
        } else {
            vm.type = 'green';
        }
    }

    function initWeixin() {
        window.WEIXINSHARE = {
            shareTitle: '邀你共度神秘八小时！',
            shareUrl: window.location.href,
            shareImg: 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png',
            shareDesc: '偷偷告诉你，这是顶级机构的省时法宝，你也来试试！',
            shareButton: 'hide'
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
        ErrorService.alert(err.msg);
    }

    function inviteAction() {
        var HOST = location.host;
        var url = '//' + HOST + '/m/#/rongzi/authInvestor?type=' + vm.type + '&inviteCode=' + vm.inviteCode;
        window.location.href = url;

        //$state.go('rongzi.authInvestor', { type: 'orange' });
    }
}