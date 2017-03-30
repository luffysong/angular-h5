
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('MainController', MainController);

function MainController(loading, $scope, $modal, $stateParams, FindService,
    $state, UserService, RongziService, ErrorService) {
    var vm = this;
    vm.subscribe = subscribe;
    vm.detail = moreDetail;
    init();

    function init() {
        initData();
        loading.show('findLoading');
        removeHeader();
        initTitle();
        //console.log(UserService.getUID());
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
        $modal.open({
            templateUrl: 'templates/rongzi/remindAlert.html',
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
                }).catch((err) => {
                        fail(err);
                    });
    }

    function fail(err) {
        ErrorService.alert(err.err.msg);
    }
}
