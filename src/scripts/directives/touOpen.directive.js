/**
 * Directive Name: touOpen
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('touOpen', touOpen);

function touOpen(hybrid, loading, $timeout, versionService, $state) {
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

        //大于等于2.6.2版本
        if (versionTou && versionService.cprVersion(versionTou, '2.6.2')) {
            hybrid.open(scope.path);
        } else if (versionTou && versionService.cprVersion(versionTou, '2.6')) {
            if (scope.path.substring(0, 11) === 'projectsSet') {
                var endNum = scope.path.indexOf('?');
                $state.go('demos', {
                    id: parseInt(scope.path.substring(12, endNum)),
                    type: 'projects'
                }, { reload: true });
            } else {
                hybrid.open(scope.path);
            }
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
