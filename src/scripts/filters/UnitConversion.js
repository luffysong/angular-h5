/**
 * Filter Name: unitConversion
 */

var angular = require('angular');

angular.module('defaultApp.filter').filter('unitConversion', function () {
    return function (input, useText) {
        if(!input){
            return "￥0";
        }else{
            var i = parseInt(input);
            return i >= 10000 ? "￥"+(i / 10000) +"万" : "￥"+i;
        }
    };
});
