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

        $scope.share = function($event) {
            $event.preventDefault();
            $modal.open({
                windowClass: 'invite-share-window',
                templateUrl: 'templates/syndicates/invite/pop-invite-share.html',
                controller: [
                    '$scope', '$modalInstance',
                    function($scope, $modalInstance) {
                        $scope.ok = function() {
                            $modalInstance.dismiss();
                        }
                    }]
            });
        };
    });

