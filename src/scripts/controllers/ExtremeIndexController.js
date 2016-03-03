/**
 * Controller Name: ExtremeIndexController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('ExtremeIndexController',
    function ($scope, ExtremeSerivce, $stateParams, ErrorService, UserService, $modal) {

        var nowMs = new Date().getTime();
        var INVESTOR_TYPE = {
            GOOD_INVESTOR:10,
            INVESTOR: 20,
            NORMAL: 100
        };
        initScope();
        function initScope() {
            loadExtreme();
            $scope.apply = apply;
            $scope.uid = UserService.getUID();
            $scope.arrayLimit = [1, 2, 3, 4, 5];
            $scope.saveText  = '提交报名信息';
            openInvestorValidate();
        }

        function openInvestorValidate() {
            UserService.investorType(function (investorType) {
                if (parseInt(investorType) === INVESTOR_TYPE.NORMAL) {
                    $modal.open({
                        templateUrl: 'templates/extreme/pop-investor-guide.html',
                        windowClass: 'pop-investor-validate',
                        backdrop: 'static'
                    });
                }
            });

        }

        function loadExtreme() {
            ExtremeSerivce.get({
                id: $stateParams.id
            }, function (data) {
                $scope.extreme = data;
                $scope.limit2 = limit2;
                $scope.extreme.selectDomains = [];
                $scope.saveText = getSaveText(data.beginDate, data.endDate);
                $scope.applyIsValid = applyIsValid;
            });
        }

        function applyIsValid() {
            var extreme = $scope.extreme;
            var timeValid = extreme.beginDate < nowMs && extreme.endDate > nowMs;
            var dataValid = extreme.selectDomains.length > 0 && $scope.investorInfo.$valid;
            var domainMeetNumValid = extreme.selectDomains.every(function (data) {
                return data.num;
            });

            return timeValid && dataValid && domainMeetNumValid;
        }

        function limit2(domain) {
            var domains = $scope.extreme.selectDomains;
            return domains.length < 2 || domains.indexOf(domain) !== -1;
        }

        function getSaveText(startMs, endMs) {
            var text = '提交报名信息';
            if (nowMs < startMs) {
                text = '活动未开始';
            }

            if (nowMs > endMs) {
                text = '活动已结束';
            }

            return text;
        }

        function apply(e) {
            e.preventDefault();

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

