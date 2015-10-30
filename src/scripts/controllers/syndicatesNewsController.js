/**
 * Controller company_name: ApplyProvisionController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesNewsController',
    function($scope, $modal, ErrorService, $stateParams,DictionaryService,$timeout,CrowdFundingService,UserService,$state,loading,CMSService) {
        $scope.news = {
            showNav:true,
            keyword:""
        };
        /*当前新闻类型*/
        $scope.newsType = "";
        $scope.pageNo = 1;
        var pageSize = 3;
        /*默认新闻页数*/
        var newsPageSize = 12;
        $scope.newsPageNo = 1;
        $scope.totalPage = 1;
        $scope.activePid = "";
        /*是否用关键字查询*/
        $scope.keywordSearch = false;
        /*新闻分类Column*/
        $scope.newsList = [{
            name:"全部",
            id:"",
            active:true
        }];
        var statusList = DictionaryService.getDict("crowd_funding_status");
        $scope.switchNews = function(index,pid){
            if($scope.newsList[index].active)return;
            $scope.showLoading("syndicatesNewsList");
            angular.forEach($scope.newsList,function(obj,index){
                obj.active = false;
            });
            $scope.loadNews({
                column_id:pid
            });
            $scope.activePid = pid;
            $scope.newsList[index].active = true;
            $scope.newsPageNo = 1;
            $scope.keywordSearch = false;
        }
        // 获取首页 banner
        $timeout(function() {
            CMSService.getZhongchouBanner().success(function(data){
                $scope.banners = data;
                $scope.hideLoading("newsBanner");
            }).catch(function(){
                $scope.banners = [];
            });
        }, 1000);

        /*新闻分类Column*/
        $scope.loadNewsColumn = function(){
            CrowdFundingService["sm"].get({
                "id":"news-column",
                pid:2
            },function(data){
                if(!data.list.length)return;
                angular.forEach(data.list,function(obj){
                    obj.active = false;
                    $scope.newsList.push(obj);
                });
            },function(err){
                ErrorService.alert(err);
            });
        }
        /*处理日期*/
        $scope.handleDate = function(date){
            return moment(date).format('YYYY年MM月DD日');
        };
        $scope.showLoading = function(name){
            loading.show(name);
        }
        $scope.hideLoading = function(name){
            $timeout(function(){
                loading.hide(name);
            },100);
        }
        /*加载新闻*/
        $scope.loadNews = function(params,way){
            var defaults = {
                per_page:newsPageSize,
                page:1,
                id:"news",
                pid:2
            };
            angular.extend(defaults,params);
            /*关键字查询*/
            if(defaults.title){
                $scope.keywordSearch = true;
                $scope.keywordText = defaults.title;
            }else{
                $scope.keywordSearch = false;
            }
            CrowdFundingService["sm"].get(defaults,function(data){
                if(!data.info || !data.info.data || !data.info.data.length){
                    $scope.newsData = [];
                    $scope.totalItems = 0;
                    if(way != "push"){
                        $scope.totalPage = 1;
                    }
                    $scope.hideLoading("syndicatesNewsList");
                    return;
                }else{
                    if(defaults.title){
                        $scope.totalItems = data.info.total;
                    }
                    $scope.totalPage = Math.ceil(data.info.total / newsPageSize);
                }
                /*数据处理*/
                angular.forEach(data.info.data,function(obj){
                    obj.time = $scope.handleDate(obj.created_at);
                });
                if(way != "push"){
                    $scope.newsData = data.info.data;
                }else{
                    $scope.newsData = $scope.newsData.concat(data.info.data);
                }
                $scope.hideLoading("syndicatesNewsList");
            },function(err){
                ErrorService.alert(err);
            });
        }
        /*新闻加载更多*/
        $scope.loadMore = function(){
            $scope.newsPageNo++;
            if($scope.keywordSearch){
                $scope.loadNews({
                    title:$scope.news.keyword,
                    page:$scope.newsPageNo
                },"push");
            }else{
                if($scope.activePid){
                    $scope.loadNews({
                        column_id:$scope.activePid,
                        page:$scope.newsPageNo
                    },"push");
                }else{
                    $scope.loadNews({
                        page:$scope.newsPageNo
                    },"push");
                }
            }
        }
        $scope.submit = function(){
            $scope.searchData();
        }
        /*根据标题查询*/
        $scope.searchData = function(){
            if($scope.news.keyword === "")return;
            angular.forEach($scope.newsList,function(obj){
                if(obj.name == "全部"){
                    obj.active = true;
                }else{
                    obj.active = false;
                }
            });
            $scope.loadNews({
                title:$scope.news.keyword
            });
            $scope.activePid = "";
            $scope.newsPageNo = 1;
            $scope.showLoading("syndicatesNewsList");
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
        /*随机更换项目*/
        $scope.changeProject = function(){
            loading.show("randomList");
            $scope.getRandomProject();
        }
        $scope.getRandomProject();
        /*加载新闻分类Column*/
        $scope.loadNewsColumn();
        /*加载新闻*/
        $scope.loadNews();

    });
