/**
 * Filter Name: month
 */

var angular = require('angular');

angular.module('defaultApp.filter').filter('month', function () {
    return function (input) {
        if (input === 1) {
            return '一月';
        } else if (input === 2) {
            return '二月';
        } else if (input === 3) {
            return '三月';
        } else if (input === 4) {
            return '四月';
        } else if (input === 5) {
            return '五月';
        } else if (input === 6) {
            return '六月';
        } else if (input === 7) {
            return '七月';
        } else if (input === 8) {
            return '八月';
        } else if (input === 9) {
            return '九月';
        } else if (input === 10) {
            return '十月';
        } else if (input === 11) {
            return '十一月';
        } else if (input === 12) {
            return '十二月';
        }

    };
});
