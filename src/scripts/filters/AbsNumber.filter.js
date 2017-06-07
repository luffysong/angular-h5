/**
 * Filter Name: MoneyUnit
 */

var angular = require('angular');

angular.module('defaultApp.filter').filter('absNumber', function () {
    return function (input) {
        return Math.abs(input);
    };
});
