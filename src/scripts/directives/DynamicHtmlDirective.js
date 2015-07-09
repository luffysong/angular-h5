/**
 * Directive Name: dynamicHtml
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('dynamicHtml', [
    '$location', '$compile',
    function ($location, $compile) {
        return {
            restrict: 'AE',
            link: function (scope, element, attrs) {
                scope.$watch(attrs.dynamicHtml, function(html){
                    console.log(element.contents());
                    element.html(html);
                    $compile(element.contents())(scope);
                })
            }
        };
    }
]);;
