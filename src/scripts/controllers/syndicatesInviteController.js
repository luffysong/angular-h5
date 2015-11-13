/**
 * Controller Name: syndicatesInviteController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('SyndicatesInviteController',
    function($scope, $state, $stateParams, $modal, notify, $timeout, loading, UserService, CrowdFundingService, ErrorService, DictionaryService, CoInvestorService) {
        loading.show("syndicatesInvite");

        $scope.uid = UserService.getUID();
        $scope.isLogin = !!UserService.getUID();

        CrowdFundingService["coupon"].get({
            per_page: 50
        },function(data) {
            $scope.couponList = data.data;
            loading.hide("syndicatesInvite");
        },function(err) {
            ErrorService.alert(err);
        });

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

