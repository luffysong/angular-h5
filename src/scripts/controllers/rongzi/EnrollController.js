var angular = require('angular');
angular.module('defaultApp.controller')
  .controller('EnrollController', EnrollController);

function EnrollController(loading, $stateParams, RongziService, $state, UserService, ErrorService, $modal) {
    var vm = this;
    vm.projectList = [];
    vm.enrollEvent = enrollEvent;
    vm.isLogin = false;
    vm.modalOpen = modalOpen;
    init();
    function init() {
        removeHeader();
        loading.hide('findLoading');
        initData();
        if (UserService.getUID()) {
            vm.isLogin = true;
        }
    }

    function removeHeader() {
        $('.common-header.J_commonHeaderWrapper').remove();
    }

    function initData() {
        RongziService.getManagedProjects()
            .then(function (response) {
                vm.projectList = response.data.data;
            }).catch(fail);
    }

    function enrollEvent(ccid) {
        vm.modalOpen();

        params = {
            ccid: ccid
        };
        RongziService.enroll(params)
            .then(function (response) {
                console.log(ccid);
                angular.forEach(vm.projectList, function (o) {
                    if (o.ccid === ccid) {
                        console.log(o);
                        o.projectId = response.data.projectId;
                        o.applied = true;
                    }
                });
            }).catch(fail);
    }

    function modalOpen() {
        var info = {
            title: '已报名成功！',
            content: '点击查看分享页，可分享给好友为你点赞！'
        };
        $modal.open({
            templateUrl: 'templates/rongzi-common/enrollMessage.html',
            windowClass: 'nativeAlert_wrap',
            controller: modalController,
            controllerAs: 'vm',
            resolve: {
                obj: function () {
                    return info;
                }
            }
        });
    }

    modalController.$inject = ['$modalInstance', 'obj'];
    function modalController($modalInstance, obj) {
        var vm = this;
        vm.title = obj.title;
        vm.content = obj.content;
        vm.cancelModal = cancelModal;

        function cancelModal() {
            $modalInstance.dismiss();
        }

    }


    function initTitle(t) {
        document.title = t;
    }


    function fail(err) {
        ErrorService.alert(err.err.msg);
    }
}
