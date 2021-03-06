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

    function initWeixin(name, desc, logo) {
        window.WEIXINSHARE = {
            shareTitle: '【创投助手·融资季】' + name + '正在参与最有号召力创业项目评选，请投我一票！',
            shareUrl: window.location.href,
            shareImg: logo,
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

            initWeixin(vm.project.name, vm.project.brief, vm.project.logo);
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
            clickSetTrack('SeasonDownloadClick', 'company_favour_download', $stateParams.id);
        } else if (!UserService.getUID()) {
            window.location.href = 'https://passport.36kr.com/pages';
        } else if (UserService.getUID() && hybrid.isInApp) {
            if (id) {
                interActApp(id);
            }

            //     .then(function (response) {
            //         vm.project.likes = response.data.curCount;
            //         vm.project.liked = true;
            //     });
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
        krdata.type = window.projectEnvConfig.linkmeType;
        krdata.params =
            '{"openlink":"https://' + window.projectEnvConfig.rongHost + '/m/#/rongzi/share?id=' + $stateParams.id + '","currentRoom":"0"}';

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

    function upgrade(item, up) {
        item = item ? item : {};
        item.openUrl = vm.openUrl;
        if (up) {
            item.upgrade = true;
        };

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
        vm.upgrade = obj.upgrade;
        vm.cancelModal = cancelModal;

        function cancelModal() {
            $modalInstance.dismiss();
        }
    }

    function openApp(type) {
        if (!hybrid.isInApp) {
            defaultModal();
            if (type === 'logo') {
                clickSetTrack('SeasonDownloadClick', 'company_logo_download', $stateParams.id);
            }
        } else {
            hybrid.open('crmCompany/' + vm.project.ccid);
        }
    }

    function clickSetTrack(event, source, company_id) {
        var params = {
            source: source,
            client: 'H5',
            company_id: parseInt(company_id)
        };
        sa.track(event, params);
    };

    function interActApp(id) {
        var isAndroid = !!navigator.userAgent.match(/android/ig) || navigator.userAgent.match(/36kr-Tou-Android\/([0-9.]+)/i);
        var isIos = !!navigator.userAgent.match(/iphone|ipod|ipad/ig) || navigator.userAgent.match(/36kr-Tou-iOS\/([0-9.]+)/i);
        if (isAndroid) {
            if (!window.kr36 || !window.kr36.thumbsUp) {
                upgrade(null, 'upgrade');
                return function () {};
            }else {
                setTimeout(function () {
                    var sig = window.kr36.thumbsUp();
                    if (sig) {
                        likeWithSig(id, sig);
                    }
                }, 100);
            }
        } else if (isIos) {
            if (!window.KrWebViewObject || !window.KrWebViewObject.thumbsUp) {
                upgrade(null, 'upgrade');
                return;
            } else {
                setTimeout(function () {
                    var sig = window.KrWebViewObject.thumbsUp();
                    if (sig) {
                        likeWithSig(id, sig);
                    }
                }, 100);
            }
        }
    }

    function likeWithSig(id, sig) {
        var sendata = {
            sig: sig
        };
        RongziService.likeWithSig(id, sendata)
            .then(function (response) {
                vm.project.likes = response.data.curCount;
                vm.project.liked = true;
            })
            .catch(fail);
    }
}
