/**
 * Filter Name: WanText
 */

var angular = require('angular');

angular.module('defaultApp.filter').filter('wanText', function () {
    return function (input) {
        var reg = /万|亿/;
        input = input + "";

        if(input.match(reg)){
            return input;
        }

        return input + '万';
    };
});
