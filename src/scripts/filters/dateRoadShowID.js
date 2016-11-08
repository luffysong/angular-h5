/**
 * Filter Name: dateRoadShowID
 */

var angular = require('angular');

angular.module('defaultApp.filter').filter('dateRoadShowID', function () {
    return function (input) {
        var temp = moment(new Date(input)).format('YYYYMMDD');
        if (String(temp) === 'Invalid date') {
            return;

        }

        return 'date' + temp;
    };
});
