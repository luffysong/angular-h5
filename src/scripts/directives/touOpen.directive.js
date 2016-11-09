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
        },
        link: function (scope, element) {
            element.click(function openApp(e) {
                if (hybrid.isInApp) {
                    e.preventDefault();
                    addClickEvent(scope);
                }
            });

        }
    };

    function addClickEvent(scope) {
        loadingUI(scope);

        //安卓示例:36kr-Tou-Android/2.6  ios示例:36kr-Tou-iOS/2.6
        var matchesTou = navigator.userAgent.match(/36kr-Tou-[a-zA-Z]{3,7}\/([0-9]\.[0-9])/i);

        var versionTou = matchesTou && matchesTou[1] && parseFloat(matchesTou[1]);

        if (versionTou && versionTou > 2.5) {
            hybrid.open(scope.path);
        } else if (versionTou && versionTou <= 2.5) {
            hybrid.open('company/' + scope.pid);
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
