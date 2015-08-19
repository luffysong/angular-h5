/**
 * Service Name: StartupService
 */

var angular = require('angular');

angular.module('defaultApp.service').service('StartupService', [
    '$location', '$http', 'BasicService', 'appendTransform',
    function ($location, $http, BasicService, appendTransform) {
        var service = BasicService('/api/p/activity/enterprise-fest/:activity', {

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
                post: {
                    method: 'POST',
                    transformRequest: appendTransform($http.defaults.transformRequest, function(data) {
                        return data;
                    })
                }
            },
            code: {
                post: {
                    method: 'POST',
                    transformRequest: appendTransform($http.defaults.transformRequest, function(data) {
                        return data;
                    })
                }
            },
            'start-remind': {
                post: {
                    method: 'POST',
                    transformRequest: appendTransform($http.defaults.transformRequest, function(data) {
                        return data;
                    })
                }
            }
        });

        return service;
    }
]);