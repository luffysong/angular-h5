/**
 * Controller Name: CompanyCapitalHistoryController
 */

var angular = require('angular');
angular.module('defaultApp.controller').controller('CompanyCapitalHistoryController',
    function($scope, $location, $stateParams, $state, CompanyService, $timeout,
              UserService, ErrorService, $rootScope, DictionaryService,
              SocialService) {
        $scope.companyId = $stateParams.id;
        $scope.fullCapital = true;
        $scope.title = '融资经历';
        $scope.finance = {};
        CompanyService['past-finance'].query({
                id:$scope.companyId
            }, function(data) {
                $scope.finance.originListCount = data.data.length;
                $scope.finance.list = data.data;
            });
    });

