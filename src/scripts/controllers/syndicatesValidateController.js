/**
 * Controller Name: syndicatesValidateController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('SyndicatesValidateController',
    function($scope, $state, $stateParams, $modal, notify, $timeout, loading, UserService, ErrorService, DictionaryService, CoInvestorService) {
        loading.show("syndicatesValidate");

        $timeout(function() {
            loading.hide("syndicatesValidate");
        }, 500);

        $scope.uid = UserService.getUID();
        $scope.isLogin = !!UserService.getUID();

        $scope.investor = {
            "name": '',
            "id": '',
            "id-confirm": '',
            "email": '',
            "phone": '',
            "captcha": '',
            "company": '',
            "work": '',
            "address": '',
            "condition": ''
        };
    });

