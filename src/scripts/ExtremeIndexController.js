/**
 * Controller Name: ExtremeIndexController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('ExtremeIndexController',
    function ($scope, ExtremeSerivce, $stateParams, ErrorService, SuccessService) {

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
            });
        }

        function apply(e) {
            e.preventDefault();
            var extreme = $scope.extreme;
            ExtremeSerivce.update({
                id: $stateParams.id
            }, {
                id: $stateParams.id,
                corpName: extreme.organizationName,
                position: extreme.job
            }, function () {
                SuccessService.alert('报名成功');
            }, function (err) {

                ErrorService.alert({
                    msg: err.msg
                });
            });
        }
    });
