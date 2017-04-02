var angular = require('angular');
angular.module('defaultApp.controller')
  .controller('EnrollController', EnrollController);

function EnrollController(loading, $stateParams, RongziService, $state, UserService, ErrorService) {
    var vm = this;
    vm.projectList = [];
    vm.enrollEvent = enrollEvent;
    init();
    function init() {
        removeHeader();
        loading.hide('findLoading');
        initData();
    }

    function removeHeader() {
        $('.common-header.J_commonHeaderWrapper').remove();
    }

    function initData() {
        RongziService.getManagedProjects()
            .then(data => {
                vm.projectList = data.data.data;
            }).catch(fail);
    }

    function enrollEvent(ccid) {
        params = {
            ccid: ccid
        }
        RongziService.enroll(params)
            .then(data => {
                angular.forEach(this.projectList, o => {
                  if (o.ccid === ccid) {
                    o.projectId = data.data.projectId;
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
