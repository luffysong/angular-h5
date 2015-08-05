/**
 * Service Name: CoInvestorService
 */

var angular = require('angular');

angular.module('defaultApp.service').service('CoInvestorService',
    function ($location, BasicService, appendTransform, $http) {
        var service = BasicService('/api/p/co-investor/:uid/:obj/:oid', {
        }, {
            obj: [
                'my-financing'
            ]
        }, {
            'my-financing': {
                query: {
                    method: 'GET',
                    transformResponse:appendTransform($http.defaults.transformResponse, function (data) {
                        var res = data;
                        try {
                            var list = res.data.data;
                            list.forEach(function(item) {
                                if(!item || !item.financing) return;
                                item.percent = (parseInt(item.financing.cf_success_raising) * 100 / parseInt(item.financing.cf_raising)).toFixed(0);

                                item.financing.close_time = item.financing.close_time.indexOf('0000-00-00') > -1 ? "" : new Date(item.financing.close_time);

                                setInvestor(item.financing);
                            });
                        } catch(e) {

                        }
                        return res;
                    })
                }
            }
        });


        function setInvestor(item){
            var types = {
                'company':"COMPANY",
                'organization':"ORGANIZATION",
                'leader':"INDIVIDUAL",
                'user':"INDIVIDUAL"
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
);
