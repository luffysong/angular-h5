var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('OrganizationController', OrganizationController);

function OrganizationController(loading, $scope, $modal, $stateParams, RongziService, $state, UserService,
    ErrorService, FindService, hybrid, orgList) {
    var vm = this;
    vm.subscribe = subscribe;
    vm.getFinishedData = getFinishedData;
    vm.needApp = true;
    vm.investRole = false;
    vm.hasEmail = false;
    vm.openApp = openApp;
    vm.openAppUrl;
    vm.tabChange = tabChange;
    vm.Aafter = true;
    vm.Abefore = false;
    vm.category = $stateParams.category;

    //分页处理
    vm.page = 0;
    vm.busy = false;
    vm.end = [];

    init();

    function init() {
        loading.hide('findLoading');
        if (!hybrid.isInApp) {
            initLinkmeInvestor();
            vm.needApp = false;
        }

        initData();
        initUser();
        initWeixin();
        initPxLoader();
    }

    function tabChange(e) {
        var obj = angular.element(e.currentTarget);
        var id = obj.attr('id');
        obj.parent().children().removeClass('tab-org-selected');
        obj.addClass('tab-org-selected');
        if ('AAfter' === id) {
            vm.Aafter = true;
            vm.Abefore = false;
            resetData(1);
        } else if (('ABefore') === id) {
            vm.Aafter = false;
            vm.Abefore = true;
            resetData(0);
        }
    }

    function resetData(n) {
        vm.page = 0;
        vm.busy = false;
        vm.end = [];
        vm.projectCategory = n;
        getFinishedData();
    }

    function initWeixin() {
        window.WEIXINSHARE = {
            shareTitle: '【创投助手·融资季】紧跟TOP机构不掉队，顶级机构在融项目触手可得！',
            shareUrl: window.location.href,
            shareImg: 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png',
            shareDesc: '为认可的顶级机构助威，20家顶级机构最热在融项目一键直约，不要错过！',
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
        if (orgList.data) {
            vm.result = orgList.data;
            if (orgList.data.sessions) {
                vm.ABefore = orgList.data.sessions.ABefore;
                vm.AAfter = orgList.data.sessions.AAfter;
            }

            initTitle('融资季 · 顶级机构专场');
        }

    }

    function getFinishedData() {
        if (vm.busy) return;
        vm.busy = true;

        var senddata = {
            category: parseInt($stateParams.category),
            projectCategory: vm.projectCategory ? vm.projectCategory : 0,
            page: vm.page + 1,
            pageSize: 5,
        };
        RongziService.getFinishedData(senddata)
            .then(function setCommunity(response) {
                vm.end = vm.end.concat(response.data.data);
                if (response.data.totalPages) {
                    vm.page = response.data.page || 0;

                    if (response.data.totalPages !== vm.page) {
                        vm.busy = false;
                    } else {
                        vm.finish = true;
                        vm.more = true;
                    }
                }
            }).catch(fail);
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

    function initTitle(t) {
        document.title = '融资季 · 顶级机构专场';
    }

    function fail(err) {
        ErrorService.alert(err.msg);
    }

    function initLinkmeInvestor() {
        var krdata = {};
        krdata.type = window.projectEnvConfig.linkmeType;
        krdata.params =
            '{"openlink":"https://' + window.projectEnvConfig.rongHost + '/m/#/rongzi/organization?id=' + $stateParams.id + '&category=' + $stateParams.category + '","currentRoom":"0"}';
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
                    //console.log(data.url,   $('#comm-openApp11').attr('href'));
                    vm.openAppUrl = data.url;
                    $('#comm-openApp').attr('href', data.url);
                }
            }, false);
        });
    }

    function subscribe(item, e) {
        e.preventDefault();
        e.stopPropagation();
        item = item ? item : {};
        item.investRole = vm.investRole;
        item.hasEmail = vm.hasEmail;
        if (!hybrid.isInApp) {
            //document.location.href = vm.openAppUrl;
            defaultModal();
        } else if (hybrid.isInApp && vm.result.remind === 1 && UserService.getUID()) {
            subscribeAction(item);
        } else if (UserService.getUID() && vm.result.remind === 0 && UserService.getUID()) {
            cancelSubscribeAction(item);
        } else {
            window.location.href = 'https://passport.36kr.com/pages';
        }
    }

    modalController.$inject = ['$modalInstance', 'obj', 'hybrid'];

    function modalController($modalInstance, obj, hybrid) {

        var vm = this;
        vm.item = obj;
        vm.cancelModal = cancelModal;
        vm.title = obj.title;
        vm.investRole = obj.investRole;
        vm.hasEmail = obj.hasEmail;
        vm.cancelMainRemind = obj.cancelMainRemind;
        vm.cancelRemindtxt = obj.cancelRemindtxt;
        vm.needApp = true;
        vm.setEmailState = false;
        vm.addEmail = addEmail;
        vm.remindText = '顶级机构专场任一专场';

        function cancelModal() {
            $modalInstance.dismiss();
        }

        function addEmail() {
            var senddata = {
                email: vm.emailInput,
            };
            if (vm.emailInput) {
                RongziService.setEmail(senddata)
                    .then(function setSussess() {
                        vm.title = '添加邮件提醒成功！';
                        vm.cancelRemindtxt = '当顶级机构专场任一专场开始时，您将会包括邮件在内的所有提醒，' +
                            '确保您不会错过任一机构专场';
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
            category: -1,
            subscibeType: 0,
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
                vm.result.remind = 0;
            })
            .catch(fail);
    }

    function cancelSubscribeAction(item) {
        var senddata = {
            category: -1,
            subscibeType: 0,
        };
        RongziService.cancelSubscribe(senddata)
            .then(function setSussess() {
                item.cancelMainRemind = true;
                item.title = '取消开场提醒成功！';
                item.hasEmail = true;
                item.cancelRemindtxt = '后续新上的顶级机构专场将不会有专场提醒，现已有排期的专场仍会提醒！';
                modalOpen(item);
                vm.result.remind = 1;
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

}