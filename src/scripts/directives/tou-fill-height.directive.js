/**
 * Directive Name: touFillHeight
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('touFillHeight',
    function ($timeout, $window) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                var rect = element[0].getBoundingClientRect();
                var height = $window.innerHeight;
                element.css('height', height - rect.top + 'px');
            },
        };
    }
);
