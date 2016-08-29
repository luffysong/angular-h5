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
                        addClickEvent(scope, e);
                        setTimeout(function () {
                            krtracker('trackEvent', 'click', 'android.h5.demoslist.download.' + pid);
                            setTimeout(function () {
                                document.location = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.android36kr.investment';
                            }, 200);
                        }, 1000);
                    }else if (/iphone/i.test(userSystem)) {
                        setTimeout(function () {
                            krtracker('trackEvent', 'click', 'ios.h5.demoslist.download.' + pid);
                            setTimeout(function () {
                                document.location = 'http://36kr.com/company/' + pid + '?ktm_source=xiangmuji.' + pid;
                            }, 200);
                        }, 1000);

                    }
                } else {
                    addClickEvent(scope, e);
                }
            });

        }
    };

    function addClickEvent(scope, e) {
        var path = scope.path;
        var pid = scope.pid;
        e.preventDefault();
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
