/**
 * Filter Name: demoNameDufault
 */

var angular = require('angular');

angular.module('defaultApp.filter').filter('demoNameDufault', function () {
    return function (input) {
        if (input.length > 1) {
            return input.substr(0, 2);
        }
    };
});
