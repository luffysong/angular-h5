/**
 * Controller Name: CompanyTipsController
 */

var angular = require('angular');
angular.module('defaultApp.controller').controller('CompanyTipsController',
    function ($scope, $location, $stateParams, $state, CompanyService, $timeout,
              UserService, ErrorService, $rootScope, DictionaryService,
              SocialService){
            $scope.companyId = $stateParams.id;
            $scope.fullTips = true;
            $scope.title='项目动态';
            CompanyService.feed.get({
                id:$scope.companyId
            },function(data){
                $scope.feeds = data.data;
            });
    });



