/**
 * Controller company_name: ApplyProvisionController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesNewsDetailController',
    function($scope, ErrorService, $stateParams,DictionaryService,$timeout,CrowdFundingService,$state,loading) {
        var pageSize = 3;
        var statusList = DictionaryService.getDict("crowd_funding_status");
        $scope.newsDetail = {
        };
        $scope.qrcodeUrl = location.href;
        $scope.newsDetail.id = $stateParams.id;
        /*分享config*/
        $scope.config = {};
        $scope.mailConfig = {};
        $scope.config.desc = "刚看到这篇文章不错，推荐给你看看～";
        /*处理日期*/
        $scope.handleDate = function(date){
            var d = new Date(date);
            return d.getFullYear()+"年"+ (d.getMonth()+1)+"月"+ d.getDate()+"日";
        }
        /*分享*/
        $scope.shareSyndicate = function () {
            $scope.config.url = $scope.mailConfig.body = encodeURIComponent(location.href);
        }
        CrowdFundingService["sm"].get({
            id:"news",
            submodel:$scope.newsDetail.id
        },function(data){
            console.log(data);
            if(!data.info)return;
            data.info.time = $scope.handleDate(data.info.updated_at);
            $scope.newsDetail.detail = data.info;
            $scope.config.title = $scope.mailConfig.subject = window.WEIXINSHARE.shareTitle = $scope.newsDetail.detail.title+"【36氪股权投资】";
            $timeout(function(){
                loading.hide("newsDetail");
            },100);
        },function(err){
            ErrorService.alert(err);
        });
        /*右侧正在融资的项目*/
        $scope.getRandomProject =  function(){
            CrowdFundingService["crowd-funding-random"].get({
                "per_page":pageSize
            },function(data){
                console.log(data);
                if(!data.data)return;
                $scope.projectList = data.data;
                $scope.handleData();
                loading.hide("randomList");
            },function(err){
                ErrorService.alert(err);
            });
        }
        /*右侧融资项目数据处理*/
        $scope.handleData = function(){
            if(!$scope.projectList.length)return;
            angular.forEach($scope.projectList,function(key){
                if(parseInt(key.cf_success_raising_offer) === 0 || !key.cf_success_raising_offer || !key.cf_raising){
                    key.percent = 0;
                }else{
                    key.percent = (parseInt(key.cf_success_raising_offer) * 100 / parseInt(key.cf_raising)).toFixed(0);
                    key.percent = key.percent > 100 ? "100%" : key.percent+"%";
                }
                angular.forEach(statusList,function(obj,i){
                    if(key.status == obj.value){
                        key.name = obj.desc;
                        /*status为众筹中*/
                        if(key.status == 30){
                            /*众筹未开始*/
                            var startTime = new Date(key.start_time);
                            if(new Date() < startTime){
                                var minute = startTime.getMinutes() > 9 ? startTime.getMinutes() : "0"+startTime.getMinutes();
                                key.name = "锚定中 " + (parseInt(startTime.getMonth())+1)+"月"+startTime.getDate()+"日  "+startTime.getHours()+":"+minute+"  开放募资";
                            }
                        }
                    }
                })
            });
        }
        /*随机更换项目*/
        $scope.changeProject = function(){
            loading.show("randomList");
            $scope.getRandomProject();
        }
        $scope.getRandomProject();
        window.WEIXINSHARE = {
            shareTitle: "刚看到这篇文章不错，推荐给你看看～",
            shareDesc: "刚看到这篇文章不错，推荐给你看看～",
            shareImg: "http://krid-assets.b0.upaiyun.com/uploads/user/avatar/132821/d6bdf8ce-5fca-4cfe-860b-70c8db293b8f.png",
            shareLink: location.href
        };
        InitWeixin();
    });
