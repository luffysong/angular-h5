/**
 * Filter Name: dateRoadShow
 */

var angular = require('angular');

angular.module('defaultApp.filter').filter('dateRoadShow', function () {
    return function (input) {
        var temp = moment(new Date(input)).format('MM/DD');
        if (String(temp) === 'Invalid date') {
            return;

        }

        return temp;
    };
});
