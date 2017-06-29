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
                isinvestor:'=isinvestor',
                item: '=',
                key:'=',
            },
            templateUrl: 'templates/directive/bangdan/pro-item.html',
            link: function (scope, element, attrs) {
                scope.$watch('isinvestor', function (newValue, oldValue) {
                    //console.log(newValue, oldValue);
                });
            }
        };
    }
);
