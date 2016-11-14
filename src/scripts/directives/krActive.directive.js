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
        var timeID;
        element.bind('touchstart', function touchstart() {
            timeID = setTimeout(function () {
                element.addClass(className);
            }, 300);
        });

        element.on('touchmove', function touchmove() {
            clearTimeout(timeID);
            element.removeClass(className);
        });

        element.on('touchend', function touchend() {
            clearTimeout(timeID);
            element.removeClass(className);
        });

        element.on('click', function click() {
            clearTimeout(timeID);
            element.removeClass(className);
            element.addClass('find-clicked');
        });
    }
}
