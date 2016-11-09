/**
 * Filter Name: findDefault
 */

var angular = require('angular');

angular.module('defaultApp.filter').filter('findDefault', function () {
    return function (input, value) {
        if (input === undefined) {
            return value;
        } else {
            return input;
        }
    };
});
