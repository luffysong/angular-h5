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
            var pid = scope.pid;
            element.click(function openApp(e) {
                if (!hybrid.isInApp) {
                    var userSystem = navigator.userAgent; //userAgent
                    if (userSystem.indexOf('Android') > -1) {
                        addClickEvent(scope);
                        krtracker('trackEvent', 'click', 'android.h5.demoslist.download.' + pid);
                    }else if (/iphone/i.test(userSystem)) {
                        krtracker('trackEvent', 'click', 'ios.h5.demoslist.download.' + pid);
                    }
                } else {
                    e.preventDefault();
                    addClickEvent(scope);
                }
            });

        }
    };

    function addClickEvent(scope) {
        var path = scope.path;
        var pid = scope.pid;
        loadingUI(scope);
        if (pid) {
            hybrid.openProject(pid);
        } else {
            hybrid.open(path);
        }
    }

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
