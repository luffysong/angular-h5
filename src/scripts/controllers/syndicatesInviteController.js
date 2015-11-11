/**
 * Controller Name: syndicatesInviteController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('SyndicatesInviteController',
    function($scope, $state, $stateParams, $modal, notify, $timeout, loading, UserService, ErrorService, DictionaryService, CoInvestorService) {
        loading.show("syndicatesInvite");

        $timeout(function() {
            loading.hide("syndicatesInvite");
        }, 1500);

        $scope.uid = UserService.getUID();
        $scope.isLogin = !!UserService.getUID();

        $scope.viewInviteRecord = function($event) {
            $event.preventDefault();
            $modal.open({
                windowClass: 'invite-record-window',
                templateUrl: 'templates/syndicates/invite/pop-invite-record.html',
                controller: [
                    '$scope', 'scope', '$modalInstance',
                    function($scope, scope, $modalInstance) {
                        $scope.ok = function() {
                            $modalInstance.dismiss();
                        }
                    }],
                    resolve: {
                        scope: function() {
                            return $scope;
                        }
                    }
            });
        };
    });

