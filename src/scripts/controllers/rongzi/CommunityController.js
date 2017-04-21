var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('CommunityController', CommunityController);

function CommunityController($document, $timeout, $scope, $modal, loading, $stateParams,
    RongziService, FindService, $state, UserService, ErrorService, hybrid, comList) {
    var vm = this;
    vm.subscribe = subscribe;
    vm.getFinishedData = getFinishedData;
    vm.needApp = true;
    vm.investRole = false;
    vm.hasEmail = false;
    vm.openApp = openApp;
    vm.openAppUrl;
    vm.tabChange = tabChange;
    vm.Aafter = false;
    vm.Abefore = true;
    vm.category = $stateParams.category;
    vm.goDetail = goDetail;

    //分页处理
    vm.page = 0;
    vm.busy = false;
    vm.end = [];

    init();

    function init() {
        if (!hybrid.isInApp) {
            initLinkmeComm();
            vm.needApp = false;
        }

        loading.hide('findLoading');
        initUser();
        initData();
        initWeixin();
        initPxLoader();
    }

    function initWeixin() {
        window.WEIXINSHARE = {
            shareTitle: '【创投助手·融资季】创业圈“黄埔军校”输出，为认可的创业基因助威。',
            shareUrl: window.location.href,
            shareImg: 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png',
            shareDesc: '每周2个创业者社群精品项目选送，名企名校类及其他社群类，快来对接项目！',
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
        if (comList.data) {
            vm.result = comList.data;
            vm.remind = vm.result.remind;
            if (comList.data.sessions) {
                vm.goodSchoolCompany = comList.data.sessions.goodSchoolCompany;
                vm.workAssociation = comList.data.sessions.workAssociation;
            }
        }
    }

    function getFinishedData() {
        if (vm.busy) return;
        vm.busy = true;

        var senddata = {
            category: parseInt($stateParams.category),
            projectCategory: angular.isUndefined(vm.projectCategory) ? 0 : vm.projectCategory,
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

                    // if (response.data.commonEmail) {
                    //     vm.hasEmail = true;
                    // }
                }
            });
    }

    function initTitle(t) {
        document.title = '融资季 · 创业社群专场';
    }

    function fail(err) {
        ErrorService.alert(err.msg);
    }

    function initLinkmeComm() {
        var krdata = {};
        krdata.type = window.projectEnvConfig.linkmeType;
        krdata.params =
            '{"openlink":"https://' + window.projectEnvConfig.rongHost + '/m/#/rongzi/community?id=' + $stateParams.id + '&category=' + $stateParams.category + '","currentRoom":"0"}';
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
            clickSetTrack('SeasonDownloadClick', 'branch_download', 'comdetail');
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
        vm.needApp = true;
        vm.title = obj.title;
        vm.investRole = obj.investRole;
        vm.hasEmail = obj.hasEmail;
        vm.cancelMainRemind = obj.cancelMainRemind;
        vm.cancelRemindtxt = obj.cancelRemindtxt;
        vm.needApp = true;
        vm.setEmailState = false;
        vm.addEmail = addEmail;
        vm.remindText = '创业社群专场任一专场';

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
                        vm.cancelRemindtxt = '当创业社群专场任一专场开始时，您将会包括邮件在内的所有提醒，' +
                            '确保您不会错过任一社群专场';
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
            category: 0,
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
            category: 0,
            subscibeType: 0,
        };
        RongziService.cancelSubscribe(senddata)
            .then(function setSussess() {
                item.cancelMainRemind = true;
                item.title = '取消开场提醒成功！';
                item.hasEmail = true;
                item.cancelRemindtxt = '后续新上的社群专场将不会有专场提醒，现已有排期的专场仍会提醒！';
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

    function goDetail(id, name, category, state) {
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
            source:'branch_session',
            client:client,
        });

        $state.go('rongzi.comdetail', {
            category: category,
            id: id,
            name: name,
            state: state
        });
    }

    function clickSetTrack(event, source, branch_id) {
        var params = {
            source: source,
            client: 'H5',
            branch_id: branch_id
        };

        sa.track(event, params);
    };
}
