
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('MainController', MainController);

function MainController(loading, $scope, $stateParams, ActivityService, $state, UserService, ErrorService) {
    var vm = this;
    vm.subscribe = subscribe;
    init();

    function init() {
        var loader = new PxLoader(),
        backgroundImg = loader.addImage('images/rongzi/backg.png');
        loader.start();
        loading.show('findLoading');
        console.log('==', backgroundImg);
        removeHeader();
        initTitle();
        //$('html').css('overflow', 'auto');
        //$('body').css('overflow', 'auto');
        //console.log(UserService.getUID());
        //start();

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

    function subscribe() {

    }

    $scope.$watch('$viewContentLoaded', function () {
        loading.hide('findLoading');
    });
}
