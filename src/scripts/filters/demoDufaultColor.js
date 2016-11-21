/**
 * Filter Name: demoDefaultColor
 */

var angular = require('angular');

angular.module('defaultApp.filter').filter('demoDefaultColor', function () {
    return function (input) {
        if (input % 4 === 0) {
            return '#d99664';
        } else if (input % 4 === 1) {
            return '#627184';
        } else if (input % 4 === 2) {
            return '#12bace';
        } else if (input % 4 === 3) {
            return '#917fb3';
        }

    };
});
