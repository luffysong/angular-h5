/**
 * Controller Name: syndicatesShareController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('SyndicatesShareController',
    function($scope, $state, $stateParams, $modal, notify, $timeout, loading, UserService, ErrorService, DictionaryService, CoInvestorService) {
        loading.show("syndicatesShare");

        $timeout(function() {
            loading.hide("syndicatesShare");
        }, 1500);

        $scope.uid = UserService.getUID();
        $scope.isLogin = !!UserService.getUID();
    });

