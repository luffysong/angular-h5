/**
 * Filter Name: demoNameDufault
 */

var angular = require('angular');

angular.module('defaultApp.filter').filter('splitName', function () {
    return function (input, num) {
        if (input && input.length && input.length >= num) {
            return '该机构';
        }
    };
});
