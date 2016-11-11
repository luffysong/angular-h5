/**
 * Directive Name: touOpen
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('touOpen', touOpen);

function touOpen(hybrid, loading, $timeout, versionService) {
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

        var versionTou = versionService.getVersionAndroid() || versionService.getVersionIOS();

        //高于2.5版本
        if (versionTou && versionService.cprVersion(versionTou, '2.5')) {
            hybrid.open(scope.path);
        } else {
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
