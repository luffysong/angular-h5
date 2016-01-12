/**
 * Service Name: PastInvestService
 */

var angular = require('angular');

angular.module('defaultApp.service').service('InvestorauditService', [
    '$location', '$http',
    function($location, $http) {
        var service = {
            name: 'InvestorauditService',

            //拉取个人、机构或公司自己填写的投资明细
            get:function(data, callback, error) {
                $http.get('/api/investoraudit/').success(function(data) {
                    callback && callback(data);
                }).catch(function(err) {
                    error && error(err);
                });
            },

            save:function(data, callback, error) {
                $http.post('/api/investoraudit/', $.param(data, true)).success(function(response) {
                    callback && callback(response);
                }).catch(function(err) {
                    error && error(err);
                });
            },

            //查询投资人认证状态
            queryStatus:function(data, callback, error) {
                $http.get('/api/investoraudit?action=check').success(function(response) {
                    callback && callback(response);
                }).catch(function(err) {
                    error && error(err);
                });
            }
        };

        return service;
    }
]);
