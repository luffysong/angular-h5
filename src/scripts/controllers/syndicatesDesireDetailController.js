/**
 * Controller company_name: ApplyProvisionController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesDesireDetailController',
    function($scope, $modal, ErrorService, $stateParams,DictionaryService,$timeout,CrowdFundingService,UserService,$state,loading) {
        loading.show("desireDetail");
        document.title = "创客筹赞";
        /*百度分享config*/
        $scope.config = {};
        $scope.showShade = false;
        $scope.shareSyndicate = function(){
            $scope.config.url = encodeURIComponent(location.href);
        }
        $scope.config.title = "创客筹赞 | 想融资，没人比我更赞";
        $scope.config.desc = "9月10日，一次战役解决PR与融资双重难题，群雄逐鹿，只有最棒的你才能傲视群雄！";
        $scope.cityData = DictionaryService.getLocation();
        $scope.industryData = DictionaryService.getDict("CompanyIndustry");
        $scope.isWeiXin = /MicroMessenger/gi.test(navigator.userAgent) ? true : false;
        /*处理地区数据*/
        $scope.handleCity = function(data){
            angular.forEach($scope.cityData,function(obj,index){
                if(obj.id == data.company.address1){
                    data.company.location = obj.name;
                }
            });
        };

        /*点赞功能*/
        $scope.praise = function(){
            /*未登录*/
            if(!UserService.getUID()){
                $modal.open({
                    templateUrl: 'templates/syndicates/desire/un-login.html',
                    windowClass:"desire-modal-window",
                    controller: [
                        '$scope', '$modalInstance','scope',
                        function ($scope, $modalInstance, scope) {
                            $scope.login = function(){
                                location.href = '/user/login?from=' + encodeURIComponent(location.href);
                            }
                            $scope.cancel =  function(){
                                $modalInstance.dismiss();
                            }
                        }
                    ],
                    resolve: {
                        scope: function(){
                            return $scope;
                        }
                    }
                });
            }else{
                /*获取用户是否为跟投人*/
                UserService.getIdentity(function(data){
                    if(data){
                        $scope.isCoInvestor = data.coInvestor ? true : false;
                    }else{
                        $scope.isCoInvestor = false;
                    }
                });
                CrowdFundingService["activity"].put({
                    id:"cf-seed",
                    submodel:$scope.companyDetail.id,
                    subid:"like"
                },{},function(data){
                    if($scope.isCoInvestor){
                        $modal.open({
                            templateUrl: 'templates/syndicates/desire/thirty-point.html',
                            windowClass:"desire-modal-window",
                            controller: [
                                '$scope', '$modalInstance','scope',
                                function ($scope, $modalInstance, scope) {
                                    $scope.isWeiXin = scope.isWeiXin;
                                    $scope.wxShare = function(){
                                        $modalInstance.dismiss();
                                        scope.showShade = true;
                                        $("body").css("overflow","hidden");
                                    }
                                    /*百度分享config*/
                                    $scope.config = {};
                                    $scope.shareSyndicate = function(){
                                        $scope.config.url = encodeURIComponent(location.href);
                                    }
                                    $scope.config.title = scope.config.title;
                                    $scope.config.desc = scope.config.desc;
                                    $scope.cancel =  function(){
                                        $modalInstance.dismiss();
                                    }
                                }
                            ],
                            resolve: {
                                scope: function(){
                                    return $scope;
                                }
                            }
                        });
                        $scope.point = 30;
                        $scope.companyDetail.counter = parseInt($scope.companyDetail.counter)+30;
                    }else {
                        $modal.open({
                            templateUrl: 'templates/syndicates/desire/one-point.html',
                            windowClass:"desire-modal-window",
                            controller: [
                                '$scope', '$modalInstance','scope',
                                function ($scope, $modalInstance, scope) {
                                    $scope.cancel =  function(){
                                        $modalInstance.dismiss();
                                    }
                                }
                            ],
                            resolve: {
                                scope: function(){
                                    return $scope;
                                }
                            }
                        });
                        $scope.point = 1;
                        $scope.companyDetail.counter++;
                    }

                },function(err){
                    console.log(err);
                    if(err.code == 2100){
                        if($scope.isCoInvestor){
                            $modal.open({
                                templateUrl: 'templates/syndicates/desire/repeat-point-suc.html',
                                windowClass:"desire-modal-window",
                                controller: [
                                    '$scope', '$modalInstance','scope',
                                    function ($scope, $modalInstance, scope) {
                                        $scope.isWeiXin = scope.isWeiXin;
                                        $scope.wxShare = function(){
                                            $modalInstance.dismiss();
                                            scope.showShade = true;
                                            $("body").css("overflow","hidden");
                                        }
                                        /*百度分享config*/
                                        $scope.config = {};
                                        $scope.shareSyndicate = function(){
                                            $scope.config.url = encodeURIComponent(location.href);
                                        }
                                        $scope.config.title = scope.config.title;
                                        $scope.config.desc = scope.config.desc;
                                        $scope.cancel =  function(){
                                            $modalInstance.dismiss();
                                        }
                                    }
                                ],
                                resolve: {
                                    scope: function(){
                                        return $scope;
                                    }
                                }
                            });
                        }else{
                            $modal.open({
                                templateUrl: 'templates/syndicates/desire/repeat-point.html',
                                windowClass:"desire-modal-window",
                                controller: [
                                    '$scope', '$modalInstance','scope',
                                    function ($scope, $modalInstance, scope) {
                                        $scope.cancel =  function(){
                                            $modalInstance.dismiss();
                                        }
                                    }
                                ],
                                resolve: {
                                    scope: function(){
                                        return $scope;
                                    }
                                }
                            });
                        }
                    }
                });
            }

        }
        /*微信分享*/
        $scope.wxShare = function(){
            $scope.showShade = true;
            $("body").css("overflow","hidden");
        }
        $scope.closeShade = function(){
            $scope.showShade = false;
            $("body").css("overflow","auto");
        }
        CrowdFundingService["activity"].get({
            "id":"cf-seed",
            "submodel":$stateParams.id
        },function(data){
            $scope.handleCity(data);
            $scope.companyDetail = data;
            window.WEIXINSHARE.shareImg = $scope.companyDetail.company.logo;
            InitWeixin();
            $timeout(function(){
                loading.hide('desireDetail');
            },100);
        },function(err){
            ErrorService.alert(err);
        });
        window.WEIXINSHARE = {
            shareTitle: "创客筹赞 | 想融资，没人比我更赞",
            shareDesc: "9月10日，一次战役解决PR与融资双重难题，群雄逐鹿，只有最棒的你才能傲视群雄！",
            shareImg: "http://krplus-pic.b0.upaiyun.com/201509/08153430/df86c04afbd4c8a7.jpg",
            shareLink: location.href
        };
        InitWeixin();

    });
