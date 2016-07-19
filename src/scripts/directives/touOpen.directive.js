/**
 * Directive Name: touOpen
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('touOpen', touOpen);

function touOpen(hybrid, loading, $timeout) {
    return {
        restrict: 'AE',
        scope:{
            path: '=?',
            pid: '=?'
        },
        link: function (scope, element) {
            var path = scope.path;
            var pid = scope.pid;
            loading.hide('openApp');

            if (!hybrid.isInApp) {
                return;
            }

            element.click(function openApp(e) {
                e.preventDefault();
                loadingUI(scope);
                if (pid) {
                    hybrid.openProject(pid);
                } else {
                    hybrid.open(path);
                }

            });
        }
    };

    function loadingUI(scope) {
        scope.$evalAsync(function showLoading() {
            loading.show('openApp');
        });

        function pagehide() {
            loading.hide('openApp');
        }

        $timeout(pagehide, 2000);

    }

}
