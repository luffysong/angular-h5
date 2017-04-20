var angular = require('angular');
angular.module('defaultApp.controller')
  .controller('OrgLikeController', OrgLikeController);

function OrgLikeController($document, $timeout, $scope, $modal, loading, $stateParams,
  RongziService, FindService, $state, UserService, ErrorService, hybrid) {
    var vm = this;
    vm.needApp = true;
    vm.category = $stateParams.category;
    vm.openApp = openApp;
    vm.openAppUrl;
    init();

    function init() {
        initData();
        initTitle();
        initWeixin();
        if (!hybrid.isInApp) {
            initLinkme();
            vm.needApp = false;
        }
    }

    function initTitle() {
        document.title = '融资季 · 投资人最喜爱的机构排行榜';
    }

    function initWeixin() {
        window.WEIXINSHARE = {
            shareTitle: '【创投助手 · 融资季】项目的名义！融资季最受欢迎顶级机构！',
            shareUrl: window.location.href,
            shareImg: 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png',
            shareDesc: '创投助手融资季 “投资人最喜爱的机构排行榜”火热出炉！',
        };

        var obj = {};
        window.InitWeixin(obj);
    }

    function initLinkme() {
        var krdata = {};
        krdata.type = window.projectEnvConfig.linkmeType;
        krdata.params =
            '{"openlink":"https://' + window.projectEnvConfig.rongHost + '/m/#/rongzi/orglike?category=' + vm.category + '","currentRoom":"0"}';
        window.linkedme.init(window.projectEnvConfig.linkmeKey, {
            type: window.projectEnvConfig.linkmeType
        }, function (err, res) {
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

    function initData() {
        RongziService.getOrgLike()
            .then(function setCommunity(data) {
                    if (data.data) {
                        vm.result = data.data;
                    }
                }).catch(fail);
    }

    function fail(err) {
        ErrorService.alert(err.msg);
    }

    function openApp() {
        if (!hybrid.isInApp) {
            defaultModal();
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
}
