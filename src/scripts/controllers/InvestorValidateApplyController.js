/**
 * Controller Name: SearchController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('InvestorValidateApplyController',
    function($scope, SearchService,DictionaryService,ErrorService,DefaultService,$upload,checkForm,$timeout,UserService,$location) {
        if(!UserService.getUID()){
            location.href = "/user/login?from=" + encodeURIComponent(location.href);
            return;
        }
        $timeout(function(){
            window.scroll(0,0);
        },0);
        document.title="36氪股权众筹";
        WEIXINSHARE = {
            shareTitle: "36氪股权众筹",
            shareDesc: "成为跟投人",
            shareImg: 'http://krplus-pic.b0.upaiyun.com/36kr_new_logo.jpg'
        };
        InitWeixin();
        $scope.stageList = [];
        $scope.areaList = [];
        $scope.user = {
            investMoneyUnit:"CNY",
            rnvInvestorInfo:"V1_1"
        };
        $scope.intro = {};
        $scope.basic = {
            value:{}
        };
        $scope.intro.value = {
            intro:"",
            pictures:""
        };
        $scope.valStatus = "normal";
        $scope.hasClick = false;



    }
);
