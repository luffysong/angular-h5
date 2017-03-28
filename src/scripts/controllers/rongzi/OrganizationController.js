var angular = require('angular');
angular.module('defaultApp.controller')
  .controller('OrganizationController', OrganizationController);

function OrganizationController(loading, $stateParams, ActivityService, $state, UserService, ErrorService) {
  var vm = this;
  init();
  function init() {
    loading.hide('findLoading');

    console.log(UserService.getUID());
  }
}

