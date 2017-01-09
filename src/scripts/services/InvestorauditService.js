/**
 * Service Name: PastInvestService
 */

var angular = require('angular');

angular.module('defaultApp.service').service('InvestorauditService', [
    '$location', '$http',
    function ($location, $http) {
        var service = {
            name: 'InvestorauditService',

            //拉取个人、机构或公司自己填写的投资明细
            get:function (data, callback, error) {
                $http.get('/api/investoraudit/').success(function (data) {
                    callback && callback(data);
                }).catch(function (err) {
                    error && error(err);
                });
            },

            save:function (data) {
                return $http.post('/api/investoraudit?action=h5', $.param(data, true)).success(function (response) {
                    return response;
                });
            },

            //查询投资人认证状态
            queryStatus:function (data, callback, error) {
                $http.get('/api/investoraudit?action=check').success(function (response) {
                    callback && callback(response);
                }).catch(function (err) {
                    error && error(err);
                });
            },

            getStatus: function (callback, error) {
                $http.get('//' + projectEnvConfig.nrongHost + '/n/api/investor/auth/state').success(function (response) {
                    callback && callback(response);
                }).catch(function (err) {
                    error && error(err);
                });
            },

            //获取推荐投资人

            suggestInvestor: function (data, callback, error) {
                console.log(projectEnvConfig.nrongHost);
                $http.get('//' + projectEnvConfig.nrongHost + '/n/api/investor/auth/suggest-investor?' + $.param(data)).success(function (response) {
                    callback && callback(response);
                }).catch(function (err) {
                    error && error(err);
                });
            },

            //提交认证H5
            submit: function (data) {
                return $http.post('//' + projectEnvConfig.nrongHost + '/n/api/investor/auth?action=h5', $.param(data, true)).success(function (response) {
                    return response;
                });
            }

        };

        return service;
    }
]);
