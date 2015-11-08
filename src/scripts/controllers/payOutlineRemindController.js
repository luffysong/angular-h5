/**
 * Controller Name: syndicatesPayOutlineController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('payOutlineRemindController',
    function($scope, UserService, ErrorService, $stateParams, CrowdFundingService,$state) {
        $scope.tid = $stateParams.tid;
        $scope.type = $stateParams.type;
        $scope.cancel = function(){
            history.go(-1);
           /*if($scope.fId){
               $state.go("");
           }*/
        }
    });
