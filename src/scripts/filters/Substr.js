/**
 * Filter Name: Substr
 */

var angular = require('angular');

angular.module('defaultApp.filter').filter('substr', function () {
    return function (input, count, symbol) {
        if(!input)return input;
        if(!count){
            return input;
        }
        symbol = symbol || '...';
        if(input.length <= count){
            return input;
        }

        return input.substr(0, count) + '...';
    };
});
