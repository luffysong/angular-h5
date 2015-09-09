/**
 * Service Name: AuditService
 */

var angular = require('angular');

angular.module('defaultApp.service').service('AuditService',
    function($http, BasicService, appendTransform) {
        var service = BasicService('/api/p/audit/:action', {
        }, {
            'action': [
                'user-identity-card',
                'user-identity-card-result'
            ]
        }, {
            'user-identity-card': {
                post: {
                    method: 'POST',
                    transformResponse: appendTransform($http.defaults.transformResponse, function (res) {
                        return res;
                    })
                }
            },

            'user-identity-card-result': {
                get: {
                    method: 'GET',
                    transformResponse: appendTransform($http.defaults.transformResponse, function (res) {
                        return res;
                    })
                }
            }
        });

        return service;
    }
);

