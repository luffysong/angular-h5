/**
 * Directive Name: alertDownloadApp
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('alertDownloadApp', alertDownloadApp);

function alertDownloadApp($parse) {
    return {
        restrict: 'AE',
        controller: popController,
        controllerAs: 'vmAlertDownloadApp',
        bindToController: true,
        link: function postLink($scope, element, attr) {
            var pidExp = attr.alertDownloadApp;
            var pidFn = $parse(pidExp, null, true);
            var vm = $scope.vmAlertDownloadApp;

            element.click(function openApp(e) {
                e.preventDefault();
                var pid = pidFn($scope);
                vm.checkApp(pid);
            });
        }
    };
}

function popController($scope, $modal, hybrid) {
    var vm = this;
    vm.isInApp = hybrid.isInApp;
    vm.checkApp = checkApp;

    function checkApp(pid) {
        if (pid && (!vm.isInApp)) {
            pop(pid);
        }
    }

    // 下载app弹窗
    function pop(pid) {
        $modal.open({
            templateUrl: 'templates/demos/downLoadPop.html',
            windowClass: 'down_load_pop_wrap',
            controller: modalController,
            controllerAs: 'vm',
            resolve: {
                scope: function () {
                    return $scope;
                },

                obj: function () {
                    return {
                        pid:pid,
                    };
                }
            }
        }).result.then(allowScroll).catch(allowScroll);
    }
}

function allowScroll() {
    window.removeEventListener('touchmove', preventDefault, false);
}

modalController.$inject = ['$scope', '$modalInstance', 'scope', 'ErrorService', 'obj'];
function modalController($scope, $modalInstance, scope, ErrorService, obj) {

    var vm = this;
    vm.pid = obj.pid;
    vm.cancel = cancel;

    var hrefFront = 'https://rong.36kr.com/m/redirect.html?ktm_source=xiangmuji';
    var hrefEnd = '&redirectUrl=http%3A%2F%2Fa.app.qq.com%2Fo%2Fsimple.jsp%3Fpkgname%3Dcom.android36kr.investment';
    vm.href = hrefFront + vm.pid + hrefEnd;

    function cancel() {

        //关闭弹窗
        $modalInstance.dismiss();
    }

    window.addEventListener('touchmove', preventDefault, false);
}

function preventDefault() {
    event.preventDefault();
}
