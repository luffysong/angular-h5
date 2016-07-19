/**
 * Directive Name: loading
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('loading', [
    '$rootScope', '$compile',
    function ($rootScope, $compile) {
        $rootScope.loadingInst = $rootScope.loadingInst || {};
        var template = '<div class="loading-wrap" ng-show="loadingInst.{{name}}"><div class="spinner">' +
                '<div class="rect1"></div>\n' +
                '<div class="rect2"></div>\n' +
                '<div class="rect3"></div>\n' +
                '<div class="rect4"></div>\n' +
                '<div class="rect5"></div>\n' +
                '</div></div>';
        return {
            restrict: 'AE',
            link: function (scope, element, attrs) {
                if (!attrs.loading) {
                    return;
                }

                $rootScope.loadingInst[attrs.loading] = angular.isUndefined($rootScope.loadingInst[attrs.loading]) ?
                    true : $rootScope.loadingInst[attrs.loading];
                var html = template.replace('{{name}}', attrs.loading);
                element.html(html);
                $compile(element.contents())($rootScope);
            }
        };
    }
]).service('loading', ['$rootScope', function ($rootScope) {
    return {
        show: function (name) {
            if (angular.isUndefined($rootScope.loadingInst[name])) {
                return;
            }

            $rootScope.loadingInst[name] = true;
        },

        hide: function (name) {
            if (angular.isUndefined($rootScope.loadingInst[name])) {
                return;
            }

            $rootScope.loadingInst[name] = false;
        }
    };
}]);
