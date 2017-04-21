var angular = require('angular');
angular.module('defaultApp.controller')
  .controller('ComLikeController', ComLikeController);

function ComLikeController($document, $timeout, $scope, $modal, loading, $stateParams,
  RongziService, FindService, $state, UserService, ErrorService, hybrid) {
    var vm = this;
    vm.needApp = true;
    vm.tabChange = tabChange;
    vm.Aafter = false;
    vm.Abefore = true;
    vm.category = $stateParams.category;
    vm.openApp = openApp;
    vm.openAppUrl;
    vm.goDetail = goDetail;

    init();

    function init() {
        initData();
        initWeixin();
        initTitle();
        if (!hybrid.isInApp) {
            initLinkme();
            vm.needApp = false;
        }
    }

    function initTitle() {
        document.title = '融资季 · 投资人最喜爱的社群排行榜';
    }

    function initWeixin() {
        window.WEIXINSHARE = {
            shareTitle: '【创投助手 · 融资季】项目的名义！融资季最受欢迎创业社群！',
            shareUrl: window.location.href,
            shareImg: 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png',
            shareDesc: '创投助手融资季 “投资人最喜爱的社群排行榜”火热出炉！',
        };

        var obj = {};
        window.InitWeixin(obj);
    }

    function tabChange(e) {
        var obj = angular.element(e.currentTarget);
        var id = obj.attr('id');
        obj.parent().children().removeClass('tab-comm-selected');
        obj.addClass('tab-comm-selected');
        if ('AAfter' === id) {
            vm.Aafter = true;
            vm.Abefore = false;
            initData('1');
        } else if (('ABefore') === id) {
            vm.Aafter = false;
            vm.Abefore = true;
            initData('0');
        }
    }

    function initData(projectCategory) {
        var senddata = {
            projectCategory:projectCategory ? parseInt(projectCategory) : 0,
        };
        RongziService.getComLike(senddata)
            .then(function setCommunity(data) {
                    if (data.data) {
                        vm.result = data.data;
                    }
                }).catch(fail);
    }

    function fail(err) {
        ErrorService.alert(err.msg);
    }

    function initLinkme() {
        var krdata = {};
        krdata.type = window.projectEnvConfig.linkmeType;
        krdata.params =
            '{"openlink":"https://' + window.projectEnvConfig.rongHost + '/m/#/rongzi/comlike?category=' + vm.category + '","currentRoom":"0"}';
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

    function goDetail(id, name, category) {
        var isAndroid = !!navigator.userAgent.match(/android/ig);
        var isIos = !!navigator.userAgent.match(/iphone|ipod|ipad/ig);
        var client = 'H5';
        if (isAndroid) {
            client = 'Android';
        }else if (isIos) {
            client = 'iOS';
        }

        sa.track('SeasonSetClick',
          {
            season_set_id:'comdetail' + id,
            branch_id:'comdetail',
            source:'top_list',
            client:client,
        });

        $state.go('rongzi.orgdetail', {
            category: category,
            id: id,
            name: name
        });
    }
}
