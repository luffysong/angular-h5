var angular = require('angular');

angular.module('defaultApp.filter').filter('default', function() {
    return function(input, value) {
        return 'demo';
    };
});
