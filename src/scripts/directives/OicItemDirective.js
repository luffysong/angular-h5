/**
 * Directive Name: oictItem 机构、社群、投资人单个详情li
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('oicItem',
    function ($timeout) {
        return {
            restrict: 'E',
            scope: {
                item: '=',
                key:'=',
                symbol:'@symbol',
                isrise:'=isrise'
            },
            templateUrl: 'templates/directive/bangdan/oic-item.html',
            link: function (scope, element, attrs) {
            }
        };
    }
);
