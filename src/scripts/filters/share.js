/**
 * Filter Name:share
 */

var angular = require('angular');

angular.module('defaultApp.filter').filter('share', function() {
    return function(input) {
        if (input === undefined) {
            return '未披露';
        }

        input = input + '';
        if (input.indexOf('%') !== -1) {
            return input;
        }

        return input + '%';
    };
});
