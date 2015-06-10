/**
 * Controller Name: ApplyProvisionController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesController',
    function($scope, UserService, $modal, ErrorService, $stateParams,DictionaryService,CrowdFundingService,notify) {
        var statusList = DictionaryService.getDict("crowd_funding_status");
        /*每页几条数据*/
        var pageSize = 30;
        $scope.pageNo = 1;
        $scope.noMore = true;
        $scope.UID = UserService.getUID();
        document.title="36氪众筹";
        /*前端处理，包括融资进度百分比的计算，以及众筹状态*/
        $scope.handleData = function(){
            angular.forEach($scope.investorList,function(key,index){
                key.percent = parseInt(key.cf_success_raising) * 100 / parseInt(key.cf_raising) ;
                angular.forEach(statusList,function(obj,i){
                    if(key.status == obj.value){
                        key.name = obj.desc;
                        key.color = obj.value;
                        /*status为众筹中*/
                        if(key.status == 30){
                            /*众筹未开始*/
                            var startTime = new Date(key.start_time);
                            if(new Date() < startTime){
                                var minute = startTime.getMinutes() > 9 ? startTime.getMinutes() : "0"+startTime.getMinutes();
                                key.name = parseInt(startTime.getMonth())+1+"月"+startTime.getDate()+"日  "+startTime.getHours()+":"+minute+"  开始众筹";
                                key.color = 60;
                            }
                        }
                    }
                });
            });
            console.log($scope.investorList);
        }
        CrowdFundingService["crowd-funding"].query({
            "page":$scope.pageNo,
            "per_page":pageSize
        },function(data){
            console.log(data);
            if(!data.total || !data.per_page)return;
            $scope.noMore = data.current_page == data.last_page ? true : false;
            $scope.investorList = data.data;
            $scope.handleData();
            console.log($scope.investorList);
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
                console.log(data);
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
    });

