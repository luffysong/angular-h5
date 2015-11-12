/**
 * Controller Name: syndicatesShareController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('SyndicatesGiftController',
    function($scope, $state, $stateParams, $modal, notify, $timeout, loading, UserService, ErrorService, DictionaryService, CoInvestorService) {
        loading.show("syndicatesGift");

        $timeout(function() {
            loading.hide("syndicatesGift");
        }, 1500);

        $scope.uid = UserService.getUID();
        $scope.isLogin = !!UserService.getUID();
    });

