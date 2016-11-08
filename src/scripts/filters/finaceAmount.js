/**
 * Filter Name: financeAmount
 */

var angular = require('angular');

angular.module('defaultApp.filter').filter('financeAmount', function () {
    return function (input) {
        if (input === undefined) {
            return '暂未披露';
        } else {
            return input;
        }
    };
});
