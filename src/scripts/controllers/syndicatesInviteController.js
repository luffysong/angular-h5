/**
 * Controller Name: syndicatesInviteController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('SyndicatesInviteController',
    function($scope, $state, $stateParams, $modal, notify, $timeout, loading, UserService, ErrorService, DictionaryService, CoInvestorService) {
        loading.show("syndicatesInvite");

        $timeout(function() {
            loading.hide("syndicatesInvite");
        }, 3000);
    });

