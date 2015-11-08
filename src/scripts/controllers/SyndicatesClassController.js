/**
 * Controller: SyndicatesClassController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesClassController',
    function($scope, loading, $timeout) {
        loading.show("syndicatesClass");

        $timeout(function() {
            loading.hide("syndicatesClass");
        }, 1500);

        $scope.calculate = {
            'cal-amount': '',
            'cal-carry': '',
            'cal-manage-fee': '',
            'cal-time': '',
            'cal-valuation': '',
            'cal-valuation-exit': '',
            'cal-rate': '',
            'result': 0.00
        };

        $scope.orginal = angular.copy($scope.calculate);

        $scope.cal = function(e) {
            e.preventDefault();

            Object.keys($scope.calForm).forEach(function (key) {
                if ($scope.calForm[key] && $scope.calForm[key].$setDirty) {
                    $scope.calForm[key].$setDirty();
                }
            });

            if ($scope.calForm.$invalid) {
                return;
            }

            var raiseValuation = (($scope.calculate['cal-valuation-exit'] * 100) / ($scope.calculate['cal-valuation'] * 100) - 1).toFixed(4) * $scope.calculate['cal-amount'];
            var manageFee = $scope.calculate['cal-amount'] * $scope.calculate['cal-manage-fee'] * $scope.calculate['cal-time'] / 100;
            var result = (raiseValuation - manageFee) * (100 - $scope.calculate['cal-carry']) * (100 - $scope.calculate['cal-rate']) / (100 * 100);
            $scope.calculate.result = result.toFixed(2);
        };

        $scope.reset = function() {
            $scope.calculate = angular.copy($scope.orginal);
            $scope.calForm.$setPristine();
        };
    });
