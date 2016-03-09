/**
 * Filter Name: MoneyUnit
 */

var angular = require('angular');

angular.module('defaultApp.filter').filter('moneyUnit', function () {
    return function (input, useText) {
        if (input === 'USD') {
            return useText ? '美元' : '$';
        }else if (input === 'CNY') {
            return useText ? '人民币' : '¥';
        }

        return '';

    };
});
