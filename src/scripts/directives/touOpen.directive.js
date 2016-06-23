/**
 * Directive Name: touOpen
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('touOpen', touOpen);

function touOpen(hybrid) {
    return {
        restrict: 'AE',
        scope:{
            path: '=?',
            pid: '=?'
        },
        link: function (scope, element) {
            var path = scope.path;
            var pid = scope.pid;
            element.click(function openApp(e) {
                e.preventDefault();
                if (pid) {
                    hybrid.openProject(pid);
                } else {
                    hybrid.open(path);
                }
            });
        }
    };
}
