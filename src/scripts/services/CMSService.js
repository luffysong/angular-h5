/**
 * Service Name: CMSService
 */

var angular = require('angular');

angular.module('defaultApp.service').service('CMSService',
    function ($http) {
        var service = {
            name: "CMSService",
            url: '/api/p/sc/images',
            getRongBanner: function(){
                return $http.get(service.url, {
                    params: {
                        type:2
                    }
                });
            },
            getZhongchouBanner: function(){
                return $http.get(service.url, {
                    params: {
                        type: 41
                    }
                });
            }
        }

        return service;
    }
);
