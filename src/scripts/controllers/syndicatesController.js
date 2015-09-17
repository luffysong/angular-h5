/**
 * Controller Name: ApplyProvisionController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesController',
    function($scope, UserService, $modal, ErrorService, $stateParams,DictionaryService,CrowdFundingService,notify,$timeout,loading) {
        document.title="36氪股权投资";
        loading.show("syndicatesList");
        var statusList = DictionaryService.getDict("crowd_funding_status");
        /*每页几条数据*/
        var pageSize = 30;
        $scope.pageNo = 1;
        $scope.noMore = true;
        $scope.UID = UserService.getUID();
        /*前端处理，包括融资进度百分比的计算，以及众筹状态*/
        $scope.handleData = function(){
            angular.forEach($scope.investorList,function(key,index){
                /*
                 停止投资三种情况：
                 1.众筹超时
                 2.剩余投资金额不足
                 3.跟投人达到最多跟投人数
                 * */
                if(key.status != 25 && (key.status == 50 || new Date(key.end_time) < new Date() || (key.min_investment && key.min_investment > key.cf_max_raising - key.cf_success_raising) || key.investor_count >= key.max_coinvestor_number)){
                    key.timeout = true;
                }
                key.percent = parseInt(key.cf_success_raising_offer) * 100 / parseInt(key.cf_raising) ;
                angular.forEach(statusList,function(obj,i){
                    if(key.status == obj.value){
                        key.name = obj.desc;
                        key.color = obj.value;
                        if(key.status == 25){
                            key.name = "预热中";
                        }else if(key.status == 30 || key.status == 35){
                            /*众筹未开始*/
                            var startTime = new Date(key.start_time);
                            if(new Date() < startTime){
                                key.fundingStatus = "preheat";
                                /*var minute = startTime.getMinutes() > 9 ? startTime.getMinutes() : "0"+startTime.getMinutes();*/
                                /*key.name = parseInt(startTime.getMonth())+1+"月"+startTime.getDate()+"日  "+startTime.getHours()+":"+minute+"  开始融资";*/
                                key.name = "锚定中";
                                key.color = 60;
                            }
                        }
                    }
                });
            });
        }
        CrowdFundingService["crowd-funding"].query({
            "page":$scope.pageNo,
            "per_page":pageSize
        },function(data){
            if(!data.total || !data.per_page)return;
            $scope.noMore = data.current_page == data.last_page ? true : false;
            $scope.investorList = data.data;
            $scope.handleData();
            loading.hide("syndicatesList");
        },function(err){
            ErrorService.alert(err);
        });

        /*众筹列表加载更多*/
        $scope.loadMore = function(){
            $scope.pageNo++;
            CrowdFundingService["crowd-funding"].query({
                "page":$scope.pageNo,
                "per_page":pageSize
            },function(data){
                if(data.data.length){
                    angular.forEach(data.data,function(o){
                        $scope.investorList.push(o);
                    });
                    $scope.handleData();
                    $scope.noMore = data.current_page == data.last_page ? true : false;
                }else{
                    ErrorService.alert({"msg":"已无更多数据"});
                    $scope.noMore = true;
                }
            },function(err){
                ErrorService.alert(err);
            });
        }

        /*开投提醒*/
        $scope.startRemind = function($event,hasRemind,fundingId,index){
            $event.stopPropagation();
            if(!UserService.getUID()){
                location.href = "/user/login?from=" + encodeURIComponent(location.href);
                return;
            }
            if(hasRemind) {
                ErrorService.alert({
                    msg: "你已设置过提醒"
                });
                return;
            }else{
                $modal.open({
                    templateUrl: 'templates/company/pop-set-remind.html',
                    windowClass: 'remind-modal-window',
                    controller: [
                        '$scope', '$modalInstance','scope','UserService','CrowdFundingService',
                        function ($scope, $modalInstance, scope,UserService,CrowdFundingService) {
                            UserService.getPhone(function(data){
                                if(!data)return;
                                $scope.phone = data.slice(0,3)+"****"+data.slice(data.length-4,data.length);
                            });
                            $scope.ok = function(){
                                CrowdFundingService.save({
                                    model:"crowd-funding",
                                    id:fundingId,
                                    submodel:"opening-remind"
                                },{

                                },function(data){
                                    notify({
                                        message:"设置成功",
                                        classes:'alert-success'
                                    });
                                    $timeout(function(){
                                        notify.closeAll();
                                    },3000);
                                    scope.investorList[index].has_reminder = true;
                                    $modalInstance.dismiss();
                                },function(err){
                                    ErrorService.alert(err);
                                    $modalInstance.dismiss();
                                });
                            }
                            $scope.cancel = function() {
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
        /*已登录且已完善资料用户才能查看众筹详情*/
        $scope.UID && UserService.isProfileValid(function(data){
            if(data){
                /*获取用户是否为跟投人*/
                UserService.getIdentity(function(data){
                    if(data){
                        $scope.isCoInvestor = data.coInvestor ? true : false;
                    }else{
                        $scope.isCoInvestor = false;
                        //ErrorService.alert({msg:"获取用户角色失败"});
                    }
                });
            }
        });
        /*大图banner按钮点击事件*/
        $scope.gotoInvest = function(){
            /*判断用户是否为跟投人*/
            if($scope.isCoInvestor){
                var ele = $(".syndicates-index:eq(0)");
                $('html,body').stop().animate({scrollTop: ele.offset().top-ele.height()*0.2},400, function(){
                    console.log("Scroll");
                });
            }else{
                $modal.open({
                    templateUrl: 'templates/company/pop-investor-validate.html',
                    windowClass: 'krCode-modal-window',
                    controller: [
                        '$scope', '$modalInstance','scope',
                        function ($scope, $modalInstance, scope) {
                            $scope.cancel = function() {
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
        };
        WEIXINSHARE = {
            shareTitle: "36氪股权投资",
            shareDesc: "让创业更简单",
            shareImg: 'http://img.36tr.com/logo/20140520/537aecb26e02d'
        };
        InitWeixin();
    });

