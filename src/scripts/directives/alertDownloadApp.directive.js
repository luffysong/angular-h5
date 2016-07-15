/**
 * Directive Name: alertDownloadApp
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('alertDownloadApp', alertDownloadApp);

function alertDownloadApp($parse) {
    return {
        restrict: 'AE',
        controller: function ($scope, $modal) {
            var isInApp = !!navigator.userAgent.match(/36kr/) || window.isAppAgent;
            $scope.checkApp = function (pid) {
                if (pid && (!isInApp)) {
                    pop(pid);
                }
            };

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

            function allowScroll() {
                $(document).unbind('touchmove');
            }

            modalController.$inject = ['$scope', '$modalInstance', 'scope', 'ErrorService', 'obj'];
            function modalController($scope, $modalInstance, scope, ErrorService, obj) {

                var vm = this;
                var request = {
                    pid:obj.pid
                };
                vm.href = 'https://rong.36kr.com/m/redirect.html?ktm_source=xiangmuji' + request.pid + '&redirectUrl=http%3A%2F%2Fa.app.qq.com%2Fo%2Fsimple.jsp%3Fpkgname%3Dcom.android36kr.investment';
                vm.cancel = function () {

                    //关闭弹窗
                    $modalInstance.dismiss();
                };

                $(document).on('touchmove', function () {
                    event.preventDefault();
                });
            }
        },

        link: function ($scope, element, attr) {
            var pidExp = attr.alertDownloadApp;
            var pidFn = $parse(pidExp, null, true);

            element.click(function openApp(e) {
                e.preventDefault();
                var pid = pidFn($scope);
                $scope.checkApp(pid);
            });
        }
    };
}
