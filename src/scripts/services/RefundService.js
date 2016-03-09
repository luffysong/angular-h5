/**
 * Service Name: RefundService
 */

var angular = require('angular');

angular.module('defaultApp.service').service('RefundService',
    function ($location, BasicService, appendTransform, $http) {
        var service = BasicService('/api/p/trade-refund', {
            post: {
                method: 'POST',
                transformRequest: appendTransform($http.defaults.transformRequest, function (data) {
                    return data;
                })
            }
        });

        return service;
    }
);
