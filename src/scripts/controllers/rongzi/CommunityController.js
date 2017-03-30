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
                    vm.corUni = [];
                    vm.other = [];
                    angular.forEach(data.data.data.sessions,
                      function (dt, index, array) {
                        if (dt.projectCategory === 1) {
                            vm.other.push(dt);
                        } else if (dt.projectCategory === 0) {
                            vm.corUni.push(dt);
                        }
                    });

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
