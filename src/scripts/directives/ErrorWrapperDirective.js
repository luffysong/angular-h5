/**
 * Directive Name: errorWrapper
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('errorWrapper',
    function () {
        return {
            require: '^^form',
            restrict: 'AE',
            templateUrl: 'templates/common/error-wrapper.html',
            scope: {
                errorGroup: '=errorGroup'
            },
            link: function (scope, element, attrs, formCtrl) {
                scope.formCtrl = formCtrl;
            }
        };
    }
);
