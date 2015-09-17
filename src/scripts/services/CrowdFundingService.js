/**
 * Service Name: CompanyService
 */

var angular = require('angular');

angular.module('defaultApp.service').service('CrowdFundingService', [
    '$location', 'BasicService', 'dateFilter', 'appendTransform', '$http', '$stateParams',
    function ($location, BasicService, dateFilter, appendTransform, $http, $stateParams) {
        var service = BasicService('/api/p/:model/:id/:submodel/:subid/:childmodel', {
        }, {
            'model':[
                'crowd-funding',
                'cf-trade',
                'payment',
                'activity',
                'co-investor',
                'audit'
            ]
        }, {
            'crowd-funding': {
                query: {
                    method: 'GET',
                    transformResponse: appendTransform($http.defaults.transformResponse, function (res) {

                        var listData = res.data.data;
                        listData.forEach(function(item){
                            setInvestor(item);
                        });

                        return res;
                    })
                },
                get: {
                    method: 'GET',
                    transformResponse: appendTransform($http.defaults.transformResponse, function (res) {

                        var baseData = res.data.base;
                        baseData && setInvestor(baseData);


                        var fundingData = res.data.funding;
                        fundingData && fundingData.investors && fundingData.investors.forEach(function(item){
                            setInvestor(item);
                        });

                        return res;
                    })
                }
            },
            'cf-trade': {
                get: {
                    method: 'GET',
                    transformResponse: appendTransform($http.defaults.transformResponse, function (res) {

                        if(!res.data)return;
                        var fundingData = res.data.financing;
                        setInvestor(fundingData);

                        res.data.created_at = new Date(res.data.created_at);

                        return res;
                    })
                }
            },
            'payment':{
                get: {
                    method: 'GET',
                    transformResponse: appendTransform($http.defaults.transformResponse, function (res) {
                        return res;
                    })
                },
                put:{
                    method: 'PUT',
                    transformResponse: appendTransform($http.defaults.transformResponse, function (res) {
                        return res;
                    })
                }
            },
            'activity':{
                get: {
                    method: 'GET',
                    transformResponse: appendTransform($http.defaults.transformResponse, function (res) {
                        return res;
                    })
                },
                put:{
                    method: 'PUT',
                    transformResponse: appendTransform($http.defaults.transformResponse, function (res) {
                        return res;
                    })
                }
            },
            'co-investor': {
                save: {
                    method: "POST",
                    transformRequest: appendTransform($http.defaults.transformRequest, function(res) {
                        return res;
                    })
                },
                get: {
                    method: 'GET',
                    transformResponse: appendTransform($http.defaults.transformResponse, function (res) {
                        return res;
                    })
                }
            },
            'audit': {
                save: {
                    method: "POST",
                    transformRequest: appendTransform($http.defaults.transformRequest, function(res) {
                        return res;
                    })
                },
                get: {
                    method: 'GET',
                    transformResponse: appendTransform($http.defaults.transformResponse, function (res) {
                        return res;
                    })
                }
            }
        });


        function setInvestor(item){
            var types = {
                'organization':"ORGANIZATION",
                'leader':"INDIVIDUAL",
                'user':"INDIVIDUAL",
                "com":"COMPANY"
            };
            var keys = Object.keys(types);
            var investor = {};

            keys.forEach(function(key){
                if(item[key]){
                    investor.type = types[key];
                    angular.extend(investor, item[key]);
                    investor.logo = investor.logo || investor.avatar;
                }
            });
            item.investorData = investor;
        }


        return service;
    }
]);
