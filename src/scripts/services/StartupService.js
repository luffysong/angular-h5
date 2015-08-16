/**
 * Service Name: StartupService
 */

var angular = require('angular');

angular.module('defaultApp.service').service('StartupService', [
    '$location', '$http', 'BasicService', 'appendTransform',
    function ($location, $http, BasicService, appendTransform) {
        var service = BasicService('api/p/activity/enterprise-fest/:activity', {

        }, {
            activity: [
                'index',
                'qr-code-token',
                'code',
                'start-remind'
            ]
        }, {
            index: {
                get: {
                    method: 'GET',
                    transformRequest: appendTransform($http.defaults.transformRequest, function(data) {
                        return data;
                    })
                }
            },
            'qr-code-token': {
                get: {
                    method: 'GET',
                    transformRequest: appendTransform($http.defaults.transformRequest, function(data) {
                        return data;
                    })
                }
            },
            code: {
                get: {
                    method: 'GET',
                    transformRequest: appendTransform($http.defaults.transformRequest, function(data) {
                        return data;
                    })
                }
            },
            'start-remind': {
                get: {
                    method: 'GET',
                    transformRequest: appendTransform($http.defaults.transformRequest, function(data) {
                        return data;
                    })
                }
            }
        });

        return service;
    }
]);
