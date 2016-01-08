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
        /*处理日期*/
        $scope.handleDate = function(date){
            return moment(date).format('YYYY年MM月DD日');
        };
        /*分享*/
        $scope.shareSyndicate = function () {
            $scope.config.url = $scope.mailConfig.body = encodeURIComponent(location.href);
        }
        CrowdFundingService["sm"].get({
            id:"news",
            submodel:$scope.newsDetail.id
        },function(data){
            if(!data.info)return;
            data.info.time = $scope.handleDate(data.info.updated_at);
            $scope.newsDetail.detail = data.info;
            $scope.config.title = $scope.mailConfig.subject = $scope.config.desc = window.WEIXINSHARE.shareTitle = $scope.newsDetail.detail.title+"【36氪股权投资】";
            $timeout(function(){
                loading.hide("newsDetail");
            },100);
            $timeout(function(){
                if($("section.news-content img").length){
                    window.WEIXINSHARE.shareImg = $("section.news-content img")[0].src;
                }
                InitWeixin();
            },1000);
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
            shareTitle: "",
            shareDesc: "刚看到这篇文章不错，推荐给你看看～",
            shareImg: "https://krplus-pic.b0.upaiyun.com/201509/08153430/df86c04afbd4c8a7.jpg",
            shareLink: location.href
        };
        InitWeixin();
    });
