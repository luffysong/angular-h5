/**
 * Controller Name: ExtremeIndexController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('ExtremeIndexController',
    function ($scope, ExtremeSerivce, $stateParams, ErrorService) {

        initScope();
        function initScope() {
            loadExtreme();
            $scope.apply = apply;
            $scope.arrayLimit = [1, 2, 3, 4, 5];
        }

        function loadExtreme() {
            ExtremeSerivce.get({
                id: $stateParams.id
            }, function (data) {
                $scope.extreme = data;
                $scope.extreme.selectDomains = [];
                $scope.limit2 = limit2;
            });
        }

        function limit2(domain) {
            var domains = $scope.extreme.selectDomains;
            return domains.length < 2 || domains.indexOf(domain) !== -1;
        }

        function apply(e) {
            e.preventDefault();
            if (!$scope.investorInfo.$valid) {
                ErrorService.alert({
                    msg: '请填写所有必填项目'
                });
                return;
            }

            var extreme = $scope.extreme;
            ExtremeSerivce.investor.save({
                id: $stateParams.id
            }, {
                id: $stateParams.id,
                corpName: extreme.organizationName,
                position: extreme.job,
                weixin: extreme.weixinAccount,
                indLimit: stringifyIndustryLimit(extreme)
            }, function () {
                $scope.success = true;
            }, function (err) {

                ErrorService.alert({
                    msg: err.msg
                });
            });
        }

        function stringifyIndustryLimit(extreme) {
            return JSON.stringify(extreme.selectDomains.map(function (data) {
                return {
                    industry: data.id,
                    limit: data.num
                };
            }));
        }

    });
