var angular = require('angular');

angular.module('defaultApp.filter').filter('default', function() {
    return function() {
        return 'demo';
    };
});
