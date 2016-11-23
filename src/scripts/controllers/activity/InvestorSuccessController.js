
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('InvestorSuccessController', InvestorSuccessController);

function InvestorSuccessController($stateParams, FindService, $state) {
    var vm = this;
    init();

    function init() {
        vm.ktm_source = $stateParams.ktm_source;

        //日后活动直接根据ktm_source加载不同图片即可
        if (vm.ktm_source === 'krspace1123') {
            $('.img-front').attr('src', '/styles/images/activity/krspace/card.png');
        }

        window.parent.initCss && window.parent.initCss();

        getActivity();
    }

    //查看是否参与过活动
    function getActivity() {
        var sendData = {
            activityName: vm.ktm_source
        };
        FindService.getActivity(sendData)
            .then(function (response) {
                vm.hasSubmit = response.data.hasSubmit;
                if (!vm.hasSubmit) {
                    $state.go('findLogin', {
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
