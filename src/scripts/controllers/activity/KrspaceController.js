
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('KrspaceController', KrspaceController);

function KrspaceController($stateParams, FindService, $state, UserService) {
    var vm = this;
    vm.ktm_source = $stateParams.ktm_source;
    vm.start = start;

    init();

    function init() {
        $('html').css('overflow', 'auto');
        $('body').css('overflow', 'auto');
    }

    //查看是否参与过活动
    function start() {

        if (!UserService.getUID()) {
            console.log('未登陆');
            $state.go('findLogin', {
                ktm_source: vm.ktm_source
            });
        } else {
            getActivity();
        }
    }

    function getActivity() {
        var sendData = {
            activityName: vm.ktm_source
        };
        FindService.getActivity(sendData)
            .then(function (response) {
                vm.hasSubmit = response.data.hasSubmit;
                if (!vm.hasSubmit) {
                    $state.go('findInvestor', {
                        ktm_source: vm.ktm_source
                    });
                } else {
                    $state.go('findInvestorSuccess', {
                        ktm_source: vm.ktm_source
                    });
                }
            })
            .catch(error);
    }

    function error(err) {
        if (err.code === 403) {
            $state.go('findLogin', {
                ktm_source: vm.ktm_source
            });
        }
    }
}
