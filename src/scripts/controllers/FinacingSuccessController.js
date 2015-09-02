/**
 * Controller Name: FinacingSuccessController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('FinacingSuccessController',
    function($scope, $rootScope, $stateParams, $location, $modal, CompanyService, UserService, DictionaryService, $http, ErrorService, $timeout) {
        $scope.uid = UserService.getUID();
        $scope.stateParams = $stateParams;
    }
);