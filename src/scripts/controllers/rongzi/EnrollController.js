var angular = require('angular');
angular.module('defaultApp.controller')
  .controller('EnrollController', EnrollController);

function EnrollController(loading, $stateParams, RongziService, $state, UserService, ErrorService) {
    var vm = this;
    vm.projectList = [];
    vm.enrollEvent = enrollEvent;
    vm.isLogin = false;
    init();
    function init() {
        removeHeader();
        loading.hide('findLoading');
        initData();
        if(UserService.getUID()) {
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
        params = {
            ccid: ccid
        }
        RongziService.enroll(params)
            .then(function (response) {
                angular.forEach(this.projectList, function (o) {
                  if (o.ccid === ccid) {
                    o.projectId = response.data.projectId;
                  }
                });
            }).catch(fail);
    }

    function initTitle(t) {
        document.title = t;
    }

    function fail(err) {
        ErrorService.alert(err.err.msg);
    }
}
