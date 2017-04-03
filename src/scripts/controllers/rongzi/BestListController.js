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
    vm.investRole = false;
    vm.signUp = signUp;
    vm.like = like;

    init();
    function init() {
        removeHeader();
        loading.hide('findLoading');
        initData();
        initSignUp();
        outInitLinkme();
    }

    function removeHeader() {
        $('.common-header.J_commonHeaderWrapper').remove();
    }

    function initData() {
        var sendata = {
            page: vm.page + 1,
            pageSize:10,
        };
        RongziService.getProList(sendata)
            .then(function setProList(response) {
                    vm.prolist = vm.prolist.concat(response.data.data);
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
        $timeout(function () {
            outInitLinkme();
        }, 1000);
    }

    function initTitle(t) {
        document.title = t;
    }

    function fail(err) {
        ErrorService.alert(err.err.msg);
    }

    function signUp() {
        //e.preventDefault();
        //e.stopPropagation();
        if (!hybrid.isInApp && UserService.getUID()) {
            $modal.open({
                templateUrl: 'templates/rongzi/common/signUp.html',
                windowClass: 'nativeAlert_wrap',
                controller: modalController,
                controllerAs: 'vm',
            });
        }
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
            krdata.type = 'test';
            krdata.params =
            '{"openlink":' + window.projectEnvConfig.rongHost + '/m/#/rongzi/bestlist","currentRoom":"1"}';

            window.linkedme.init('3a89d6c23e6988e0e600d63ca3c70636',
            { type: 'test' }, function (err, res) {
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
        krdata.type = 'test';
        krdata.params =
        '{"openlink":"' + window.projectEnvConfig.rongHost + '/m/#/investor/apply"}';

        window.linkedme.init('3a89d6c23e6988e0e600d63ca3c70636',
        { type: 'test' }, function (err, res) {
                if (err) {
                    return;
                }

                window.linkedme.link(krdata, function (err, data) {
                        if (err) {
                            // 生成深度链接失败，返回错误对象err
                            console.log(err);
                        } else {
                            // 生成深度链接成功，深度链接可以通过data.url得到
                            $timeout(function () {
                                $('.like-btn').attr('href', data.url);
                            }, 1000);
                        }
                    }, false);
            });
    }

    function like(id) {
        if (!vm.inApp) {
            return;
        } else if (!UserService.getUID()) {
            window.location.href = 'https://passport.36kr.com/pages';
        } else {
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
}
