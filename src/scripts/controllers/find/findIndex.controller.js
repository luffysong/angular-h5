
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('FindIndexController', FindIndexController);

function FindIndexController(FindService, ErrorService, hybrid, loading, $interval, $scope) {
    var vm = this;

    //轮播图返回的数据
    vm.slides = [];

    //轮播图唤醒内部页面
    vm.openNativePage = openNativePage;

    //轮播图唤醒url
    vm.openUrl = openUrl;

    init();
    function init() {
        FindService.getRoundpics()
            .then(function temp(response) {
                vm.slides = angular.copy(response.data.data);
            })
            .catch(error)
            .finally(function () {
                loading.hide('demos');
            });

        interval();
    }

    function openNativePage(path) {
        if (hybrid.isInApp) {
            hybrid.open(path);
        }
    }

    function openUrl(url) {
        var path = '/openEncryptionLink/' + encodeURIComponent(url);
        openNativePage(path);
    }

    function interval() {
        getFinanceNewStr();
        getHasNew();

        //2-5分钟随机时间
        var time = parseInt(Math.random() * (300000 - 120000 + 1) + 120000);
        window.getFinanceNewStr = $interval(getFinanceNewStr, time, 30);
        window.getHasNew = $interval(getHasNew, time, 30);
        $scope.$on('$destroy', function () {
            $interval.cancel(window.getFinanceNewStr);
            $interval.cancel(window.getHasNew);
        });
    }

    //融资速递轮询
    function getFinanceNewStr() {
        FindService.getFinanceNewStr()
            .then(function temp(response) {
                vm.financeNewStr = response.data.str;
            });
    }

    //项目集轮询
    function getHasNew() {
        var psts = vm.hasNewTime || 0;
        FindService.getHasNew(psts)
            .then(function temp(response) {
                vm.hasNewTime = response.data.time;
                vm.proSetCount = parseInt(response.data.proSetCount);
            });
    }

    function error(err) {
        ErrorService.alert(err);
    }

}
