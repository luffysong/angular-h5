/**
 * Filter Name: WanNum
 */

var angular = require('angular');

angular.module('defaultApp.filter').filter('WanNum', function() {
    return function(input) {
        var num = input - 0;
        if (typeof num === 'number') {
            num = num / 10000 + '万';
        }

        return num;
    };
});
