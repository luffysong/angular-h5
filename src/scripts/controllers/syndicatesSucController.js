/**
 * Controller Name: ApplyProvisionController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesSucController',
    function($scope, UserService, ErrorService, $stateParams,DictionaryService,CrowdFundingService,CompanyService,$state,$rootScope) {
        console.log($stateParams);
        $scope.companyId = $stateParams.cid ||  $rootScope.companyId ;
        $scope.fundingId = $stateParams.fundingId ||  $rootScope.fundingId;
        $scope.share = {};
        $scope.config = {};
        CompanyService.get({
            id: $scope.companyId
        }, function(data) {
            if(!data.basic)return;
            $scope.companyName = data.basic.name;
            $scope.companyBrief = data.basic.brief;
            console.log(data);
        }, function(err) {
            ErrorService.alert(err);
        });
        /*分享功能需要通过众筹详情接口获取领投人姓名*/
        CrowdFundingService["crowd-funding"].get({
            id:$scope.fundingId
        },function(data){
            if(!data.base)return;
            $scope.config.title = encodeURIComponent("【"+data.base.investorData.name+"】"+"正在领投"+$scope.companyName + " | " + "36氪让创业更简单");
            $scope.config.desc  = encodeURIComponent("【"+data.base.investorData.name+"】"+"正在领投"+$scope.companyName + "，"+$scope.companyBrief+ " | " + "36氪让创业更简单");
        });
        $scope.shareSyndicate = function(){
            $scope.config.url = encodeURIComponent(location.href);
        }
    });

