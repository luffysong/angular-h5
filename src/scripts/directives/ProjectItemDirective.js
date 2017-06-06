/**
 * Directive Name: pro
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('projectItem',
    function ($timeout) {
        return {
            restrict: 'E',
            controllerAs: 'vm',
            scope: {
                isInvestor:'=',
                item: '=',
                key:'=',
            },
            templateUrl: 'templates/directive/bangdan/item.html',
            link: function (scope, element, attrs) {
            }
        };
    }
);
