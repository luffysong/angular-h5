var angular = require('angular');
angular.module('defaultApp.controller')
  .controller('CommunityController', CommunityController);

function CommunityController(loading, $stateParams, RongziService, $state, UserService, ErrorService) {
    var vm = this;
    init();
    function init() {
        console.log($stateParams.id);
        removeHeader();
        loading.hide('findLoading');
        initData();
    }

    function removeHeader() {
        $('.common-header.J_commonHeaderWrapper').remove();
    }

    function initData() {
        RongziService.getCommunity({ id: $stateParams.id })
            .then(function setCommunity(data) {
                    vm.result = data.data.data;
                    console.log(data);
                    initTitle(vm.result.title);
                }).catch((err) => {
                        fail(err);
                    });
    }

    function initTitle(t) {
        document.title = t;
    }

    function fail(err) {
        ErrorService.alert(err.err.msg);
    }
}
