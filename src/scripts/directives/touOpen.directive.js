/**
 * Directive Name: touOpen
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('touOpen', touOpen);

function touOpen(hybrid, loading) {
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
                if (pid) {
                    hybrid.openProject(pid);
                } else {
                    hybrid.open(path);
                }

                loadingUI();
            });
        }
    };

    function loadingUI() {
        loading.show('openApp');
        window.addEventListener('pagehide', pagehide, false);
    }

    function pagehide(loading) {
        loading.hide('openApp');
        window.removeEventListener('pagehide', pagehide);
    }
}
