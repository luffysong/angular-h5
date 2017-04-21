var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('MainController', MainController);

function MainController(loading, $scope, $modal, $stateParams, FindService,
    $state, UserService, RongziService, ErrorService, hybrid, $rootScope, $timeout) {
    var vm = this;
    vm.subscribe = subscribe;
    vm.needApp = true;
    vm.hasEmail = false;
    vm.openApp = openApp;
    vm.openAppUrl;
    vm.databackState = false;
    vm.picState = false;
    vm.goDetail = goDetail;
    init();

    function init() {
        initTitle();
        initUser();
        initWeixin();
        if (!hybrid.isInApp) {
            initLinkme();
            vm.needApp = false;
        }

        initData();
        initPxLoader();
    }

    function BackState() {
        Promise
            .all([initData(), initPxLoader()])
            .then(function(results) {
                loading.hide('rongziLoading');
            });
    }

    function initPxLoader() {
        var loader = new PxLoader();
        var imgArr = document.getElementsByTagName('img');
        for (var i = 0; i < imgArr.length; i++) {
            var pxImage = new PxLoaderImage(imgArr[i].src);
            pxImage.imageNumber = i + 1;
            loader.add(pxImage);
        }

        loader.addProgressListener(function(e) {});

        loader.addCompletionListener(function(e) {
            vm.picState = true;
        });

        loader.start();
    }

    function initWeixin() {
        window.WEIXINSHARE = {
            shareTitle: '上创投助手融资季，瞅准机会，干一票大的！',
            shareUrl: window.location.href,
            shareImg: 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png',
            shareDesc: '持续60天，每天5分钟，一年只要8小时，看遍顶级机构、明星大佬、创业社群2000+好项目。',
        };

        var obj = {};
        window.InitWeixin(obj);
    }

    function initTitle() {
        document.title = '创投助手 · 融资季';
    }

    function removeHeader() {
        $('.common-header.J_commonHeaderWrapper').remove();
    }

    window.initCss = function() {
        $('#activityInfoFirst').hide();
    };

    window.initCss();
    if (!UserService.getUID()) {
        window.initCss();
    }

    function initUser() {
        FindService.getUserProfile()
            .then(function temp(response) {
                if (response.data) {
                    if (response.data.investor) {
                        vm.investRole = true;
                    }
                }
            });
    }

    function subscribe(item, e, event, source) {
        e.preventDefault();
        e.stopPropagation();
        item = item ? item : {};
        item.investRole = vm.investRole;
        item.hasEmail = vm.hasEmail;
        if (!hybrid.isInApp) {
            defaultModal();
            clickSetTrack('SeasonDownloadClick', 'main_download');
        } else if (UserService.getUID()) {
            if (vm.remind === 1) {
                subscribeAction(item);
            } else {
                cancelSubscribeAction(item);
            }
        } else {
            window.location.href = 'https://passport.36kr.com/pages';
        }
    }

    modalController.$inject = ['$modalInstance', 'obj', 'hybrid'];

    function modalController($modalInstance, obj, hybrid) {

        var vm = this;
        vm.item = obj;
        vm.cancelModal = cancelModal;
        vm.needApp = true;
        vm.title = obj.title;
        vm.investRole = obj.investRole;
        vm.hasEmail = obj.hasEmail;
        vm.cancelMainRemind = obj.cancelMainRemind;
        vm.cancelRemindtxt = obj.cancelRemindtxt;
        vm.needApp = true;
        vm.setEmailState = false;
        vm.addEmail = addEmail;
        vm.remindText = '“融资季”全场任一专场';

        function cancelModal() {
            $modalInstance.dismiss();
        }

        function addEmail() {
            var senddata = {
                email: vm.emailInput + '',
            };
            if (vm.emailInput) {
                RongziService.setEmail(senddata)
                    .then(function setSussess() {
                        vm.title = '添加邮件提醒成功！';
                        vm.cancelRemindtxt = '当“融资季”全场任一专场开始时，您将会包括邮件在内的所有提醒，' +
                            '确保您不会错过任意专场';
                        vm.setEmailState = true;
                        vm.hasEmail = true;
                    })
                    .catch(fail);
            } else {
                $modalInstance.dismiss();
            }
        }
    }

    function subscribeAction(item) {
        var senddata = {
            subscibeType: -1,
        };
        RongziService.setSubscribe(senddata)
            .then(function setSussess(data) {
                if (data.data.data) {
                    vm.hasEmail = true;
                }

                item.hasEmail = vm.hasEmail;
                item.cancelMainRemind = false;
                item.title = '设置开场提醒成功！';
                modalOpen(item);
                vm.remind = 0;
            })
            .catch(fail);
    }

    function cancelSubscribeAction(item) {
        var senddata = {
            subscibeType: -1,
        };
        RongziService.cancelSubscribe(senddata)
            .then(function setSussess() {
                item.cancelMainRemind = true;
                item.hasEmail = true;
                item.title = '取消开场提醒成功！';
                item.cancelRemindtxt = '后续新上的所有专场将不会有专场提醒，现已有排期的专场仍会提醒！';
                modalOpen(item);
                vm.remind = 1;
            })
            .catch(fail);
    }

    function modalOpen(item) {
        $modal.open({
            templateUrl: 'templates/rongzi-common/remindAlert.html',
            windowClass: 'nativeAlert_wrap',
            controller: modalController,
            controllerAs: 'vm',
            resolve: {
                obj: function() {
                    return item;
                }
            }
        });
    }

    function initData() {
        RongziService.getHome()
            .then(function setHomeData(data) {
                loading.hide('rongziLoading');
                if (data.data) {
                    vm.result = data.data;
                    vm.remind = data.data.remind;
                    vm.starList = data.data.startupProjectVoList;
                    vm.sessions = data.data.sessions;
                    vm.org = vm.sessions.org;
                    vm.community = vm.sessions.assc;
                    vm.investor = vm.sessions.investor;
                    // if (vm.result.sessions.length > 0) {
                    //     angular.forEach(vm.result.sessions,
                    //       function (dt, index, array) {
                    //         if (dt.category === -1) {
                    //             vm.org = dt;
                    //         } else if (dt.category === 0) {
                    //             vm.community = dt;
                    //         } else {
                    //             vm.investor = dt;
                    //         }
                    //     });
                    // }
                }
            }).catch(fail);
    }

    function initLinkme() {
        var krdata = {};
        krdata.type = window.projectEnvConfig.linkmeType;
        krdata.params =
            '{"openlink":"https://' + window.projectEnvConfig.rongHost + '/m/#/rongzi/main","currentRoom":"0"}';
        window.linkedme.init(window.projectEnvConfig.linkmeKey, {
            type: window.projectEnvConfig.linkmeType
        }, function(err, res) {
            if (err) {
                return;
            }

            window.linkedme.link(krdata, function(err, data) {
                if (err) {
                    // 生成深度链接失败，返回错误对象err
                    console.log(err);
                } else {
                    // 生成深度链接成功，深度链接可以通过data.url得到
                    vm.openAppUrl = data.url;
                }
            }, false);
        });
    }

    function fail(err) {
        loading.hide('rongziLoading');
        ErrorService.alert(err.err.msg);
    }

    function openApp(event, source) {
        if (!hybrid.isInApp) {
            //window.location.href = vm.openAppUrl;
            defaultModal();
            clickSetTrack(event, source);
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
                obj: function() {
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

    function goDetail(type, id, name, category, state) {
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
            season_set_id:type + id,
            branch_id:type,
            source:'main_session',
            client:client,
        });

        $state.go('rongzi.' + type + '', {
            category: category,
            id: id,
            name: name,
            state: state
        });
    }

    function clickSetTrack(event, source) {
        var params = {
            source: source,
            client: 'H5',
        };

        sa.track(event, params);
    };

}
