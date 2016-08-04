/**
 * Directive Name: krActive
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('krActive', krActive);

function krActive($parse) {
    return {
        restrict: 'A',
        controller: angular.noop,
        link: postLink
    };

    function postLink(scope, element, attr) {
        var className = $parse(attr.krActive)();
        element.bind('touchstart', function touchstart() {
            element.addClass(className);
        });

        element.on('touchmove', function touchmove() {
            element.removeClass(className);
        });

        element.on('touchend', function touchend() {
            element.removeClass(className);
        });
    }
}
