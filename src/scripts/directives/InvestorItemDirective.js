/**
 * Directive Name: oictItem 机构、社群、投资人单个详情li
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('investorItem',
    function ($timeout) {
        return {
            restrict: 'E',
            scope: {
                item: '=',
                key:'=',
                symbol:'@symbol',
                tempurl:'@tempurl',
                isrise:'=isrise'
            },

            link: function (scope, element, attrs) {
            },

            templateUrl: 'templates/directive/bangdan/inv-item.html',
        };
    }
);
