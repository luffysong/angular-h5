var angular = require('angular');
angular.module('defaultApp.controller')
  .controller('ShareController', ShareController);

function ShareController(loading, $stateParams, RongziService, $state, UserService, ErrorService, hybrid) {
    var vm = this;
    vm.project = [];
    vm.liked = false;
    vm.like = like;
    vm.share = share;
    init();

    function init() {
        outInitLinkme();
        removeHeader();
        initData();
        loading.hide('findLoading');
    }

    function initData() {
        RongziService.shareInfo($stateParams.id)
            .then(function (response) {
                vm.project = response.data;
            }).catch(fail);
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

    function like(id) {
        if (!hybrid.isInApp) {
            window.location.href = vm.openUrl;
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

    function share(){
        if (!hybrid.isInApp) {
            window.location.href = vm.openUrl;
        }
    }

    function outInitLinkme() {
        var krdata = {};
        krdata.type = 'test';
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
}
