/**
 * Filter Name: delHtmlTag
 */

var angular = require('angular');

angular.module('defaultApp.filter').filter('delHtmlTag', function () {
    return function (input) {
        return input.replace(/<[^>]+>/g, '');
    };
});
