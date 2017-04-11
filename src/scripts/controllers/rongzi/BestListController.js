var angular = require('angular');
angular.module('defaultApp.controller')
  .controller('BestListController', BestListController);

function BestListController($modal, loading, $stateParams, FindService,
  RongziService, $state, UserService, ErrorService, hybrid, $timeout) {
    var vm = this;
    vm.displayMore = displayMore;
    vm.page = 0;
    vm.prolist = [];
    vm.more = false;
    vm.needApp = true;
    vm.signUp = signUp;
    vm.supporter = supporter;
    vm.openApp = openApp;
    vm.like = like;
    vm.rule = addRule;
    vm.openUrl;
    vm.busy = false;

    init();
    function init() {
        initUserInfo();
        loading.hide('findLoading');
        initWeixin();
        initTitle();
        if (!hybrid.isInApp) {
            outInitLinkme();
            vm.needApp = false;
        }

        initPxLoader();
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

    function removeHeader() {
        $('.common-header.J_commonHeaderWrapper').remove();
    }

    function initData() {
        if (vm.busy)return;
        vm.busy = true;

        var sendata = {
            page: vm.page + 1,
            pageSize:10,
        };
        RongziService.getProList(sendata)
            .then(function setProList(response) {
                    if (!vm.top3) {
                        var spliArr = response.data.data.splice(0, 3);
                        vm.top3 = [];
                        vm.top3[0] = spliArr[1];
                        vm.top3[1] = spliArr[0];
                        vm.top3[2] = spliArr[2];
                    }

                    vm.prolist = vm.prolist.concat(response.data.data);
                    if (response.data.totalPages) {
                        vm.page = response.data.page || 0;

                        if (response.data.totalPages !== vm.page && vm.page <= 9) {
                            vm.busy = false;
                        } else {
                            vm.finish = true;
                            vm.more = true;
                        }
                    }
                }).catch(fail);
    }

    function initUserInfo() {
        FindService.getUserProfile()
            .then(function temp(response) {
                if (response.data) {
                    if (response.data.investor) {
                        vm.investRole = true;
                    }
                }
            });
    }

    function initSignUp() {
        if (hybrid.isInApp) {
            vm.needApp = false;
        }
    }

    function displayMore() {
        initData();
    }

    function initTitle(t) {
        document.title = '融资季 · 创业项目号召力榜';
    }

    function fail(err) {
        ErrorService.alert(err.err.msg);
    }

    function addRule(p) {
        $modal.open({
            templateUrl: 'templates/rongzi-common/ruleHtml.html',
            windowClass: 'nativeAlert_wrap',
            controller: ruleController,
            controllerAs: 'vm',
            resolve: {
                obj: function () {
                    return p;
                }
            }
        });
    }

    function signUp() {
        $modal.open({
            templateUrl: 'templates/rongzi-common/signUp.html',
            windowClass: 'nativeAlert_wrap',
            controller: modalController,
            controllerAs: 'vm',
        });
    }

    modalController.$inject = ['$modalInstance', 'hybrid'];
    function modalController($modalInstance, hybrid) {

        var vm = this;
        vm.cancelModal = cancelModal;
        vm.isInSubscribe = false;
        init();

        function cancelModal() {
            $modalInstance.dismiss();
        }

        function init() {
            initLinkme();
        }

        function initLinkme() {
            var krdata = {};
            krdata.type =  window.projectEnvConfig.linkmeType;
            krdata.params =
            '{"openlink":"https://' + window.projectEnvConfig.rongHost + '/m/#/rongzi/enroll", "currentRoom" : "1"}';

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
                                $('#open-App').attr('href', data.url);
                            }
                        }, false);

                });
        }
    }

    function outInitLinkme() {
        var krdata = {};
        krdata.type =  window.projectEnvConfig.linkmeType;
        krdata.params =
        '{"openlink":"https://' + window.projectEnvConfig.rongHost + '/m/#/rongzi/bestlist","currentRoom":"0"}';

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

    function like(id) {
        if (!hybrid.isInApp) {
            //return;
            // window.location.href = vm.openUrl;
            defaultModal();
        } else if (!UserService.getUID()) {
            window.location.href = 'https://passport.36kr.com/pages';
        } else if (UserService.getUID() && hybrid.isInApp) {
            RongziService.like(id)
            .then(function (response) {
                angular.forEach(vm.prolist, function (o) {
                    if (o.id === id) {
                        o.likes = response.data.curCount;
                        o.liked = true;
                    }
                });
            });
        }
    }

    function supporter() {
        if (!hybrid.isInApp) {
            defaultModal();
        }else if (hybrid.isInApp && !vm.investRole) {
            window.location.href =  'https://' + window.projectEnvConfig.rongHost + '/m/#/investor/apply';
        }
    }

    ruleController.$inject = ['$modalInstance', 'hybrid','obj'];
    function ruleController($modalInstance, hybrid, obj) {
        var vm = this;
        vm.p = obj;
        vm.cancelModal = cancelModal;

        function cancelModal() {
            $modalInstance.dismiss();
        }
    }

    function openApp() {
        if (!hybrid.isInApp) {
            defaultModal();
        }
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
}
