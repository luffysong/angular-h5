/**
 * Controller Name: syndicatesInviteController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('SyndicatesInviteController',
    function($scope, $state, $stateParams, $modal, notify, $timeout, $interval, loading, UserService, CrowdFundingService, ErrorService, DictionaryService, CoInvestorService) {
        loading.show("syndicatesInvite");

        $scope.uid = UserService.getUID();
        $scope.isLogin = !!UserService.getUID();

        CrowdFundingService["coupon"].get({
            per_page: 50
        },function(data) {
            $scope.couponList = data.data;
            loading.hide("syndicatesInvite");
            $scope.scroll();
        },function(err) {
            ErrorService.alert(err);
        });

        var timer;
        $scope.scroll = function() {
            $timeout(function() {
                timer = $interval(function() {
                    var $recordsList = $('.records-list');
                    var $recordsItem = $recordsList.find('li');
                    var outterHeight = $recordsList.height();
                    var innerHeight = $recordsItem.height() * $recordsItem.length;

                    var scrollTop = $recordsList.scrollTop();
                    if(outterHeight + scrollTop >= innerHeight){
                        scrollTop -= (innerHeight / 2) + 10;
                    } else {
                        scrollTop++;
                    }
                    $recordsList.scrollTop(scrollTop);
                }, 30);
            }, 1000);
        };

        $scope.scroll();

        $scope.stop = function(){
            $interval.cancel(timer);
        };

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

