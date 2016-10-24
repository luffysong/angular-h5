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
            pid: '=?',
            ccid: '=?',
            demosid: '=?'
        },
        link: function (scope, element) {
            var pid = scope.pid;
            var demosid = scope.demosid;
            element.click(function openApp() {
                if (!hybrid.isInApp) {
                    var userSystem = navigator.userAgent; //userAgent
                    if (userSystem.indexOf('Android') > -1) {
                        addClickEvent(scope);
                        krtracker('trackEvent', 'click', 'android.h5.demoslist.download.' + demosid + '.' + pid);
                    }else if (/iphone/i.test(userSystem)) {
                        loadingUI(scope);
                        krtracker('trackEvent', 'click', 'ios.h5.demoslist.download.' + demosid + '.' + pid);
                    }
                } else {
                    // e.preventDefault();
                    addClickEvent(scope);
                }
            });

        }
    };

    function addClickEvent() {
        // var path = scope.path;
        // var pid = scope.pid;
        // var ccid = scope.ccid;
        // var demosid = scope.demosid;
        // loadingUI(scope);
        // if (pid && ccid) {
        //     hybrid.openProject(pid, ccid, demosid);
        // } else {
        //     hybrid.open(path);
        // }

        hybrid.open('/addBottomViewInWeb/12986');
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
