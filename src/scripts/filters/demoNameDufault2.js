/**
 * Filter Name: demoNameDufault
 */

var angular = require('angular');

angular.module('defaultApp.filter').filter('demoNameDufault2', function () {
    return function (input) {
        if (input.length > 1) {
            return input.substr(0, 1);
        }
    };
});

