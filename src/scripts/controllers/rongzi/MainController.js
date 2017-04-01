
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('MainController', MainController);

function MainController(loading, $scope, $modal, $stateParams, FindService,
    $state, UserService, RongziService, ErrorService, hybrid) {
    var vm = this;
    vm.subscribe = subscribe;
    vm.detail = moreDetail;
    init();

    function init() {
        initData();
        loading.show('findLoading');
        removeHeader();
        initTitle();
        initLinkme();
        vm.pass = false;

        if (UserService.getUID()) {
            vm.pass = true;
            vm.pwd = UserService.getUID();
        }

        console.log();
    }

    function start() {
        $state.go('normalLogin');
    }

    function moreDetail(id, type) {
        console.log(id, type);
        if (type === 'org') {
            $state.go('rongzi.org', { id: id });
        } else if (type === 'investor') {
            $state.go('rongzi.investor', { id: id });
        }else if (type === 'community') {
            $state.go('rongzi.community', { id: id });
        }
    }

    function initTitle() {
        document.title = '创投助手 · 融资季';
    }

    function removeHeader() {
        $('.common-header.J_commonHeaderWrapper').remove();
    }

    window.initCss = function () {
        $('#activityInfoFirst').hide();
    };

    window.initCss();
    if (!UserService.getUID()) {
        window.initCss();
    }

    function subscribe(item, e) {
        e.preventDefault();
        e.stopPropagation();
        if (hybrid.isInApp && UserService.getUID()) {
            $modal.open({
                templateUrl: 'templates/rongzi/common/remindAlert.html',
                windowClass: 'nativeAlert_wrap',
                controller: modalController,
                controllerAs: 'vm',
                resolve: {
                    obj: function () {
                        return item;
                    }
                }
            });
        }
    }

    function modalController($modalInstance, obj, hybrid) {

        var vm = this;
        vm.item = obj;
        vm.ktm_source = 'hot_more';
        vm.cancel = cancel;

        function cancel() {
            $modalInstance.dismiss();
        }
    }

    $scope.$watch('$viewContentLoaded', function () {
        loading.hide('findLoading');
    });

    function initData() {
        RongziService.getHome()
            .then(function setHomeData(data) {
                    vm.result = data.data.data;
                    vm.starList = data.data.data.startupProjectVoList;
                    if (vm.result.sessionCustomVoList) {
                        if (vm.result.sessionCustomVoList.length > 0) {
                            angular.forEach(vm.result.sessionCustomVoList,
                              function (dt, index, array) {
                                if (dt.category === -1) {
                                    vm.org = dt;
                                } else if (dt.category === 0) {
                                    vm.community = dt;
                                } else {
                                    vm.investor = dt;
                                }
                            });
                        }
                    }
                }).catch(fail);
    }

    function initLinkme() {
        var krdata = {};
        krdata.type = 'test';
        krdata.params =
        '{"openlink":"http://rongh5.local.36kr.com/#/rongzi/main","currentRoom":"1","weburl":"http://rongh5.local.36kr.com/#/rongzi/main"}';
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
                            console.log(data.url);
                            $('#main-open').attr('href', krdata.url);
                        }
                    }, false);
            });
    }

    function fail(err) {
        ErrorService.alert(err.err.msg);
    }
}
