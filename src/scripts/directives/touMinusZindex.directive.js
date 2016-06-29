/**
 * Directive Name: touMinusZindex
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('touMinusZindex',
    function () {
        return {
            restrict: 'AE',
            link: function (scope, element) {
                var minusIndex = element.parent().children().toArray().indexOf(element[0]);
                var zIndex = parseInt(element.css('z-index'));
                element.css('z-index', zIndex - minusIndex);
            }
        };
    }
);
