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
  }

  function tabChange(e) {
    var obj = angular.element(e.currentTarget);
    var id = obj.attr('id');
    obj.parent().children().removeClass('tab-org-selected');
    obj.addClass('tab-org-selected');
    if (('a-after')=== id) {
        vm.Aafter = true;
        vm.Abefore = false;
    }else if (('a-before')=== id) {
      vm.Aafter = false;
      vm.Abefore = true;
    }
  }
}
