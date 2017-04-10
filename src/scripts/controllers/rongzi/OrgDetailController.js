var angular = require('angular');
angular.module('defaultApp.controller')
  .controller('OrgDetailController', OrgDetailController);

function OrgDetailController($modal, loading, $stateParams, RongziService, $state, UserService, ErrorService, hybrid) {
    var vm = this;
    vm.tabChange = tabChange;
    vm.Aafter = false;
    vm.Abefore = true;

    init();

    function init() {
        loading.hide('findLoading');
        initData();
        initTitle($stateParams.name);
    }

    function tabChange(e) {
        var obj = angular.element(e.currentTarget);
        var id = obj.attr('id');
        obj.parent().children().removeClass('tab-org-selected');
        obj.addClass('tab-org-selected');
        if ('AAfter' === id) {
            vm.Aafter = true;
            vm.Abefore = false;
        } else if (('ABefore') === id) {
            vm.Aafter = false;
            vm.Abefore = true;
        }
    }

    function initData() {
        RongziService.getDetail(parseInt($stateParams.id))
            .then(function setDetail(data) {
                    if (data.data) {
                        vm.result = data.data.data;
                        if (data.data.sessions) {
                            vm.ABefore = data.data.sessions.ABefore;
                            vm.AAfter = data.data.sessions.AAfter;
                        }
                    }
                }).catch(fail);
    }

    function initTitle(t) {
        document.title = t;
    }

    function fail(err) {
        ErrorService.alert(err.err.msg);
    }

}
