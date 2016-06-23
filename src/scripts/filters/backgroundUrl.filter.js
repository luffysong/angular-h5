/**
 * Filter Name: MoneyUnit
 */

var angular = require('angular');

angular.module('defaultApp.filter').filter('backgroundUrl', function () {
    return function (input) {
        return 'url(' + input + ')';
    };
});
