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

        //service._data = [
        //    //TODO: 把机构数据写死在这里
        //];
        //
        //service.query = function(){
        //    return service._data;
        //};

        return service;
    }
]);
