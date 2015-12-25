/**
 * Service Name: BasicService
 */

var angular = require('angular');

angular.module('defaultApp.service').config([
    "$provide", "$httpProvider",
    function ($provide, $httpProvider) {
        $provide.factory('commonInterceptor', ["$q",  function ($q) {
            return {

                // optional method
                'response': function (response) {
                    if (response.config.url.indexOf('templates') > -1 ||
                        response.config.url.indexOf('template') > -1 ||
                        response.config.url.indexOf('bootstrap') > -1 ||
                        response.config.url.indexOf(projectEnvConfig.passportHost) > -1 ||
                        response.config.url.indexOf(kr.upyun.api) > -1) {
                        return response;
                    }
                    if (response.data.code != 0) {
                        if(response.data.code == 4031){
                            /*setTimeout(function(){
                                location.hash="#/guide/welcome";
                            },5000);*/
                            /*return $q.reject(nul);*/
                        }
                        return $q.reject(response.data);
                    }
                    // do something on success
                    response.data = angular.isObject(response.data.data) ? response.data.data : {
                        value: response.data.data
                    };
                    return response;
                }
            };
        }]);

        $httpProvider.interceptors.push('commonInterceptor');
        $httpProvider.defaults.headers.post = {'Content-Type': 'application/x-www-form-urlencoded'};
        $httpProvider.defaults.headers.put = {'Content-Type': 'application/x-www-form-urlencoded'};
        $httpProvider.defaults.headers.delete = {'Content-Type': 'application/x-www-form-urlencoded'};
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.transformRequest = function (data) {
            if (data === undefined) return data;
            if (!angular.isObject(data)) return data;
            var clonedData = angular.copy(data);
            var k;
            for(k in clonedData){
                if(k.indexOf('$')==0){
                    delete clonedData[k];
                }
            }
            return $.param(clonedData);
        };
    }])
    .service('appendTransform', ['$http', function ($http) {
        function appendTransform(defaults, transform) {

            if (defaults == $http.defaults.transformRequest) {
                var result = [transform, $http.defaults.transformRequest];

                return result;
            }

            // We can't guarantee that the default transformation is an array
            defaults = angular.isArray(defaults) ? defaults : [defaults];

            // Append the new transformation to the defaults
            return defaults.concat(transform);
        }

        return appendTransform;
    }])

    .service('BasicService', [
        '$location', '$http', '$resource',
        function ($location, $http, $resource) {

            var contructor = function (path, params, actions) {
                var finalActions = {
                    update: {
                        method: "PUT"
                    },
                    query: {
                        method: "GET"
                    },
                    get: {
                        method: "GET"
                    },
                    save: {
                        method: "POST"
                    },
                    remove: {
                        method: "DELETE"
                    }
                };
                actions = actions || {};
                angular.extend(finalActions, actions);
                return $resource(path, params, finalActions);
            };

            return function (path, actions, submodels, subActions) {
                var Model = contructor(path, {}, actions);
                subActions = subActions || {};

                if (!submodels)return Model;


                Object.keys(submodels).forEach(function (key) {
                    submodels[key].forEach(function (model) {
                        var params = {};
                        params[key] = model;
                        if (!!Model[model]) {
                            throw "SubModel Name Is Invalid:" + model;
                            return;
                        }
                        Model[model] = contructor(path, params, subActions[model]);
                    });
                });
                return Model;
            };
        }
    ]);
