/**
 * Controller company_name: ApplyProvisionController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesDesireController',
    function($scope, $modal, ErrorService, $stateParams,DictionaryService,$timeout,CrowdFundingService,UserService,$state) {
        document.title = "我要上众筹";
        /*保存查询条件*/
        $scope.queryParams = {};
        /*默认一页展示条数*/
        $scope.pageSize = 20;
        $scope.cityData = DictionaryService.getLocation();
        $scope.industryData = DictionaryService.getDict("CompanyIndustry");
        $scope.qrcodeUrl = encodeURIComponent("http://" + location.hostname + "/m/#/zhongchouDesire");
        $scope.activePage = 1;
        $scope.activeDesc = "";
        $scope.sort = function(way){
            var params = {};
            var obj = {
                industry:$scope.focusIndustry,
                company_name:$scope.keyword
            };
            angular.forEach(obj,function(val,key){
                if(val){
                    params[key] = val;
                }
            });
            console.log(params);
            /*按时间排序*/
            if(way == "time"){
                $scope.activeDesc = "apply_time";
                params = angular.extend(params,{
                    orderby:"apply_time"
                });
                $scope.loadData(params);
            }
            /*按热度排序*/
            else{
                $scope.activeDesc = "counter";
                params = angular.extend(params,{
                    orderby:"counter"
                });
            }
            $scope.loadData(params);
        };
        /*打开分享*/
        $scope.showShare = function(index){
            $scope.companyData[index].isShowShare = true;
        }
        /*根据公司所在领域查询*/
        $scope.industryChange = function(){
            $scope.loadData({
                industry:$scope.focusIndustry,
                company_name:$scope.keyword,
                orderby:$scope.activeDesc
            });
            //console.log($scope.focusIndustry);
            //$state.go("syndicatesDesire",{
            //    "industry":$scope.focusIndustry
            //});
        }
        /*点赞功能*/
        $scope.praise = function(index,pId,event){
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
                    submodel:pId,
                    subid:"like"
                },{},function(data){
                    console.log(data);
                    if($scope.isCoInvestor){
                        $modal.open({
                            templateUrl: 'templates/syndicates/desire/thirty-point.html',
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
                        $scope.point = 30;
                        $scope.companyData[index].isPraise = true;
                        $scope.companyData[index].counter = parseInt($scope.companyData[index].counter)+30;
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
                        $scope.companyData[index].isPraise = true;
                        $scope.companyData[index].counter++;
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
        /*加载更多*/
        /*加载更多*/
        $scope.loadMore = function(){
            if($scope.activePage == $scope.totalPage)return;
            $scope.activePage++;
            $scope.companyData = $scope.companyData.concat($scope.totalData.slice($scope.activePage*10,$scope.activePage*20));
        }
        /*处理地区数据*/
        $scope.handleCity = function(data){
            if(!data.length)return;
            angular.forEach($scope.cityData,function(obj,index){
                angular.forEach(data,function(item,key){
                    if(obj.id == item.company.address1){
                        item.company.location = obj.name;
                    }
                });
            });
        };
        /*处理数据*/
        $scope.handleData = function(data){
            if(!data.length)return;
            angular.forEach(data,function(obj){
                obj.isPraise = false;
            });
        }
        /*加载数据*/
        $scope.loadData = function(params){
            var options = {
                id:"cf-seed",
                per_page:400
            };
            params = angular.extend(options,params);
            CrowdFundingService["activity"].get(params,function(data){
                /*if(!data.data.length)return;*/
                $scope.handleCity(data.data);
                $scope.handleData(data.data);
                /* 少于或等于20条*/
                $scope.totalCount = data.total;
                $scope.totalPage = Math.ceil($scope.totalCount / $scope.pageSize);
                if(data.data.length <= $scope.pageSize){
                    $scope.companyData = data.data;
                    $scope.handleCity($scope.companyData);
                }else {
                    $scope.totalData = data.data;
                    $scope.companyData = $scope.totalData.slice(0,20);
                }

            },function(err){
                ErrorService.alert(err);
            });
        }
        /*按公司名查询*/
        $scope.searchData = function(){
            $scope.loadData({
                company_name:$scope.keyword,
                industry:$scope.focusIndustry,
                orderby:$scope.activeDesc
            });
        }
        /*按回车键查询*/
        /*$scope.enterWord = function(event){
            alert(event.keyCode);
            if(event.keyCode == 13){
                $scope.searchData();
            }
        }*/
        $scope.submit = function(){
            $scope.searchData();
        }
        /*根据url匹配查询条件*/
        $scope.urlLoad = function(){
            var params = {};
            angular.forEach($stateParams,function(val,key){
                if(val){
                    params[key] = val;
                }
            });
            $scope.loadData(params);
        }
        $scope.urlLoad();
    });
