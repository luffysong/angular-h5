/**
 * Filter Name: SimpleRender
 */

var angular = require('angular');

angular.module('defaultApp.filter').filter('SimpleRender', function () {
    return function (input) {
        if (!input)return '';
        var output = input;
        var titleReg = /(^|\n)(#\s*.+(?=\n|$))/ig;

        output = output.replace(titleReg, function ($0, $1, $2) {
            return '</span><h4>' + $2.replace('#', '') + '</h4><span>';
        })
        .replace(/\n/g, '<br/>');

        return '<span>' + output + '</span>';
    };
});
