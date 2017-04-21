var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('InvestorController', InvestorController);

function InvestorController(loading, $scope, $modal, $stateParams, RongziService, $state, UserService,
    ErrorService, FindService, hybrid, investorList) {
    var vm = this;
    vm.subscribe = subscribe;
    vm.needApp = true;
    vm.investRole = false;
    vm.hasEmail = false;
    vm.openApp = openApp;
    vm.openAppUrl;
    vm.page = 0;
    vm.more = false;
    vm.busy = false;
    vm.moreFinishedData = moreFinishedData;
    vm.finished = [];
    vm.goDetail = goDetail;

    init();

    function init() {
        if (!hybrid.isInApp) {
            initLinkmeInvestor();
            vm.needApp = false;
        }

        initData();
        initUser();
        initWeixin();
        initPxLoader();
        initTitle('融资季·明星投资人专场');
        loading.hide('findLoading');
    }

    function initWeixin() {
        window.WEIXINSHARE = {
            shareTitle: '【创投助手·融资季】明星投资人奉上独家项目集，等你来约谈！',
            shareUrl: window.location.href,
            shareImg: 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png',
            shareDesc: '40位明星投资人被投在融项目一键直约，不要错过！',
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
        if (investorList.data) {
            vm.result = investorList.data;
        }
    }

    function moreFinishedData() {
        if (vm.busy) return;
        vm.busy = true;
        var request = {
            page: vm.page += 1,
            pageSize: 2,
            category: $stateParams.category
        };
        RongziService.getFinished(request)
            .then(function setCommunity(data) {
                if (data.data) {
                    vm.finished = vm.finished.concat(data.data.data);
                    if (data.data.totalPages) {
                        vm.page = data.data.page || 0;
                        if (data.data.totalPages !== vm.page) {
                            vm.busy = false;
                        } else {
                            vm.finish = true;
                        }
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

    function initLinkmeInvestor() {
        var krdata = {};
        krdata.type = window.projectEnvConfig.linkmeType;
        krdata.params =
            '{"openlink":"https://' + window.projectEnvConfig.rongHost + '/m/#/rongzi/investor?category=' + $stateParams.category + '","currentRoom":"0"}';
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
            clickSetTrack('SeasonDownloadClick', 'branch_download', 'investorInfo');
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
        vm.setEmailState = false;
        vm.addEmail = addEmail;
        vm.remindText = '明星投资人专场任一专场';

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
                        vm.cancelRemindtxt = '当明星投资人专场任一专场开始时，您将会收到包括邮件在内的所有提醒，' +
                            '确保您不会错过任一投资人专场';
                        vm.setEmailState = true;
                        vm.hasEmail = true;
                    })
                    .catch(fail);
            } else {
                $modalInstance.dismiss();
            }
        }
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

    function subscribeAction(item) {
        var senddata = {
            category: 1,
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
            category: 1,
            subscibeType: 0,
        };
        RongziService.cancelSubscribe(senddata)
            .then(function setSussess() {
                item.cancelMainRemind = true;
                item.title = '取消开场提醒成功！';
                item.hasEmail = true;
                item.cancelRemindtxt = '后续新上的明星投资人专场将不会有专场提醒，现已有排期的专场仍会提醒！';
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

    function displayMore() {
        initData();
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

    function clickSetTrack(event, source, branch_id) {
        var params = {
            source: source,
            client: 'H5',
            branch_id: branch_id
        };
        sa.track(event, params);
    };

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
            season_set_id:'investorInfo' + id,
            branch_id:'investorInfo',
            source:'branch_session',
            client:client,
        });

        $state.go('rongzi.investorInfo', {
            category: category,
            id: id,
            name: name,
            state: state
        });
    }

}
