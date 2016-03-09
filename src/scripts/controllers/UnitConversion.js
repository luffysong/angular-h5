/**
 * Filter Name: unitConversion
 */

var angular = require('angular');

angular.module('defaultApp.filter').filter('unitConversion', function () {
    return function (input) {
        if (!input || input === 0 || input === '0') {
            return '即将开启';
        } else {
            var i = parseInt(input);
            return i >= 10000 ? '￥' + (i / 10000) + '万' : '￥' + i;
        }
    };
});
