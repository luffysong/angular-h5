/**
 * Controller Name: syndicatesPayOutlineController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('payOutlineRemindController',
    function($scope, UserService, ErrorService, $stateParams, CrowdFundingService,$state) {
        $scope.tid = $stateParams.tid;
        $scope.type = $stateParams.type;
        $scope.interFace = {
            deposit:"cf-trade-deposit",
            balance:"cf-trade-balance"
        };
        $scope.cancel = function(){
            history.go(-1);
           /*if($scope.fId){
               $state.go("");
           }*/
        }
        $scope.payOutline = function(){
            CrowdFundingService[$scope.interFace[$scope.type]].update({
                id: $scope.tid
            }, {
                platform_type: 1
            }, function() {
                $state.go('syndicatesPayOutline', {
                    tid: $scope.tid,
                    type: $scope.type
                });
            }, function(err) {
                ErrorService.alert(err);
            });
        }
    });
