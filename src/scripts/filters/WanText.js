/**
 * Filter Name: WanText
 */

var angular = require('angular');

angular.module('defaultApp.filter').filter('wanText', function() {
    return function(input) {
        if (input === undefined || input === '') {
            return '未披露';
        }

        if (typeof input === 'number') {
            input = input / 10000 + '万';
            return input;
        }

        var reg = /万|亿/;
        input = input + '';

        if (input.match(reg)) {
            return input;
        }

        return input + '万';
    };
});
