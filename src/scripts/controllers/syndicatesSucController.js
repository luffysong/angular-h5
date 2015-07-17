/**
 * Controller Name: ApplyProvisionController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesSucController',
    function($scope, UserService, ErrorService, $stateParams,DictionaryService,CrowdFundingService,CompanyService,$state,$rootScope) {
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
            $scope.config.title = encodeURIComponent("我刚跟投了"+$scope.companyName+"，正在36氪众筹");
            $scope.config.desc  = encodeURIComponent("我刚跟投了"+$scope.companyName+","+$scope.companyBrief+"。"+"领投人是【"+data.base.investorData.name+"】"+ "值得一看的公司 | " + "36氪让创业更简单");
        });
        $scope.shareSyndicate = function(){
            $scope.config.url = encodeURIComponent($scope.rongHost+'/#/zhongchouDetail?companyId='+$scope.companyId+"&fundingId="+$scope.fundingId);
        }
    });

