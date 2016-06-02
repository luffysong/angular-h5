/**
 * Service Name: OrganizationService
 */

var angular = require('angular');

angular.module('defaultApp.service').service('OrganizationService', [
    '$location', 'BasicService',    function ($location, BasicService) {
        var service = BasicService('/api/organization/:id/:sub/:subid', {

        }, {
            sub: [
                'background',
                'basic',
                'invest',
                'user',
                'top',
                'past-investment',
                'investor'
            ]
        }, {

        });
        return service;
    }
]);
