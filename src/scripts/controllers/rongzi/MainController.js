
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('MainController', MainController);

function MainController(loading, $scope, $modal, $stateParams, FindService,
    $state, UserService, ErrorService) {
    var vm = this;
    vm.subscribe = subscribe;
    init();

    function init() {
        //var loader = new PxLoader(),
        //backgroundImg = loader.addImage('images/rongzi/backg.png');
        //loader.start();
        //$('html').css('overflow', 'auto');
        //$('body').css('overflow', 'auto');
        //console.log('==', backgroundImg);
        //start();
        loading.show('findLoading');
        removeHeader();
        initTitle();
        console.log(UserService.getUID());
    }

    function start() {
        $state.go('normalLogin');
    }

    function initTitle() {
        document.title = '创投助手 · 融资季';
    }

    function removeHeader() {
        $('.common-header.J_commonHeaderWrapper').remove();
    }

    window.initCss = function () {
        $('#activityInfoFirst').hide();
    };

    window.initCss();
    if (!UserService.getUID()) {
        window.initCss();
    }

    function subscribe(item, e) {
        e.preventDefault();
        e.stopPropagation();
        $modal.open({
            templateUrl: 'templates/rongzi/remindAlert.html',
            windowClass: 'nativeAlert_wrap',
            controller: modalController,
            controllerAs: 'vm',
            resolve: {
                obj: function () {
                    return item;
                }
            }
        });
    }

    function modalController($modalInstance, obj, hybrid) {

        var vm = this;
        vm.item = obj;
        vm.ktm_source = 'hot_more';
        vm.cancel = cancel;

        function cancel() {
            $modalInstance.dismiss();
        }
    }

    $scope.$watch('$viewContentLoaded', function () {
        loading.hide('findLoading');
    });
}
