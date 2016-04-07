/**
 * Service Name: OrganizationService
 */

var angular = require('angular');

angular.module('defaultApp.service').service('OrganizationService', [
    '$location', 'BasicService', 'dateFilter', 'appendTransform', '$http', '$stateParams',
    function ($location, BasicService) {
        var service = BasicService('/api/organization/:id/:sub/:subid', {

        }, {
            sub: [
                'background',
                'basic',
                'invest',
                'user',
                'top',
                'investor'
            ]
        }, {

        });
        return service;
    }
]);
