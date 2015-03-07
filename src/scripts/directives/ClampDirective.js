/**
 * Directive Name: clamp
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('clamp', [
    '$location',
    function ($location) {
        return {
            restrict: 'AE',
            link: function (scope, element, attrs) {
                var lineVar = attrs.clamp;
                scope.$watch(lineVar, function(val){
                    $clamp(element[0], {clamp: val})
                });
            }
        };
    }
]);
