/**
 * Service Name: SocialService
 */

var angular = require('angular');

angular.module('defaultApp.service').service('SocialService',
    function($http, BasicService, appendTransform) {
        var service = BasicService('/api/:action/:id', {
        }, { 'action': [
                'likes',
                'follow',
                'unfollow',
            ]
        }, {
            'likes': {
                yes: {
                    method: 'POST',
                    params:{
                        type:'company'
                    },
                    transformResponse: appendTransform($http.defaults.transformResponse, function (res) {
                        return res;
                    })
                },
                no:{
                    method:'DELETE',
                    params:{
                        type:'company'
                    }
                }

            }, 'follow': {
                yes: {
                    method: 'POST',
                    params:{
                        type:'company'
                    },
                    transformResponse: appendTransform($http.defaults.transformResponse, function (res) {
                        return res;
                    })
                },
                no:{
                    method:'POST',
                    params:{
                        action:'unfollow',
                        type:'company'
                    }
                }
            }, 'unfollow': {
                yes: {
                    method: 'POST',
                    params:{
                        type:'company'
                    }
                }
            }
        });

        return service;
    }
);

