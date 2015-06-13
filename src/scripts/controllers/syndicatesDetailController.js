/**
 * Controller Name: ApplyProvisionController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesDetailController',
    function($scope, UserService, $modal, ErrorService, $stateParams,DictionaryService,CrowdFundingService,notify,CompanyService,$timeout) {
        var statusList = DictionaryService.getDict("crowd_funding_status");

        /*股权结构是否出错*/
        $scope.shareError = false;
        /*众筹信息是否全部展开*/
        $scope.isToggle = false;
        $scope.coInvestor = {};
        $scope.fundingId = $stateParams.fundingId;
        $scope.companyId = $stateParams.companyId;
        document.title="36氪众筹";
        /*获取用户是否为跟投人*/
        UserService.getIdentity(function(data){
            console.log(data);
            if(data.code == 4031){
                ErrorService.alert({
                    msg:"请先完善资料"
                });
                $timeout(function(){
                    location.hash="#/guide/welcome";
                },5000);
            }else if(data){
                $scope.isCoInvestor = data.coInvestor ? true : false;
            }else{
                $scope.isCoInvestor = false;
            }
        },function(err){
            ErrorService.alert(err);
        });

        /*获取公司基本信息*/
        CompanyService.get({
            id:$scope.companyId
        },function(data){
            $scope.companyData = data;
            document.title=data.basic.name + " | 36氪";
            WEIXINSHARE = {
                shareTitle: data.basic.name + " | 36氪",
                shareDesc: data.basic.brief || data.basic.name,
                shareImg: data.basic.logo || 'http://img.36tr.com/logo/20140520/537aecb26e02d'
            };
            InitWeixin();
        },function(err){
            ErrorService.alert(err);
        });
        /*获取众筹详情*/
        CrowdFundingService["crowd-funding"].get({
            id:$scope.fundingId
        },function(data){
            $scope.color = data.base.status;
            angular.forEach(statusList,function(obj,index){
                if(obj.value == data.base.status){
                    $scope.status = obj.desc;
                    var date = new Date(data.base.start_time);
                    /*超募中*/
                    if(data.base.cf_success_raising >= data.base.cf_raising && data.base.cf_raising > 0){
                        $scope.status = "超募中";
                    }
                    /*预热中*/
                    if(new Date() < date){
                        var minute = date.getMinutes() > 9 ? date.getMinutes() : "0"+date.getMinutes();
                        $scope.status = (parseInt(date.getMonth())+1)+"月"+date.getDate()+"日  "+date.getHours()+":"+minute+" 开始众筹";
                        $scope.color = 60;
                    }
                }
            });
            $scope.syndicatesInfo = data;
            if($scope.syndicatesInfo.base){
                $scope.syndicatesInfo.base.percent = parseInt($scope.syndicatesInfo.base.cf_success_raising) * 100 / parseInt($scope.syndicatesInfo.base.cf_raising);
            }
            if(!$scope.syndicatesInfo.detail)return;
            $scope.shareError = parseInt($scope.syndicatesInfo.detail.es_funding_team) + parseInt($scope.syndicatesInfo.detail.es_investor) + parseInt($scope.syndicatesInfo.detail.es_staff) == 100 ? false : true;
            var chartData = [$scope.syndicatesInfo.detail.es_investor,$scope.syndicatesInfo.detail.es_funding_team,$scope.syndicatesInfo.detail.es_staff];
            angular.forEach($scope.chartConfig.series[0].data,function(obj,index){
                /*当百分比为0时，默认为30*/
                obj[1] = chartData[index] == 0 ? 30 : chartData[index];
                /*obj[1] = chartData[index];*/
            });

        },function(err){
            ErrorService.alert(err);
        });
        /*过往投资方数据获取*/
        CompanyService.finance.query({
            id:$stateParams.companyId
        },{},function(data){
            if(data.data && data.data.length){
                $scope.pastInvestor = data.data;
                angular.forEach($scope.pastInvestor,function(obj){
                    if(!obj.investDate)return;
                    var date = new Date(obj.investDate);
                    obj.investTime = date.getFullYear()+"."+(parseInt(date.getMonth())+1);
                });
            }
        },function(err){
            ErrorService.alert(err);
        });

        /*展开更多众筹信息*/
        $scope.toggleMore = function(){
            $scope.isToggle = true;
        }
        /*底部栏点击我要投资*/
        $scope.toInvest = function(){
            $modal.open({
                templateUrl: 'templates/company/pop-to-invest.html',
                windowClass: 'to-invest-window',
                controller: [
                    '$scope', '$modalInstance','scope',
                    function ($scope, $modalInstance, scope) {
                        $scope.cancel = function(){
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
        /*开投提醒*/
        $scope.setRemind = function(event){
            event.stopPropagation();
            if(!UserService.getUID()){
                location.href = "/user/login?from=" + encodeURIComponent(location.href);
                return;
            }
            if($scope.syndicatesInfo.base.has_reminder) {
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
                                    id:scope.fundingId,
                                    submodel:"opening-remind"
                                },{

                                },function(data){
                                    notify({
                                        message:"设置成功",
                                        classes:'alert-success'
                                    });
                                    scope.syndicatesInfo.base.has_reminder = true;
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
        //股权结构
        $scope.stockStructure = {};
        $scope.chartConfig = {
            size:{
                height:180
            },
            options: {
                //This is the Main Highcharts chart config. Any Highchart options are valid here.
                //will be overriden by values specified below.
                /*chart: {
                    width:540
                },*/
                tooltip: {
                    style: {
                        padding: 10,
                        fontWeight: 'bold'
                    },
                    formatter: function () {
                        return this.key + "　" + this.y+"%";
                    }
                },

                colors: ['#01af94','#ff7777', '#ffb24f'],

                plotOptions: {
                    pie: {
                        size:"90%",
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false
                        },
                        showInLegend: true,
                        point: {
                            events: {
                                legendItemClick: function () {
                                    return false; // <== returning false will cancel the default action
                                }
                            }
                        }
                    }
                },

                legend: {
                    align: 'right',
                    verticalAlign: 'middle',
                    layout: 'vertical',
                    itemMarginBottom: 10,
                    labelFormatter: function () {
                        return this.name + "　" + this.y+"%";
                    }
                }
            },
            //The below properties are watched separately for changes.

            //Series object (optional) - a list of series using normal highcharts series options.
            series: [{
                type: 'pie',
                name: 'Browser share',
                borderWidth: 0,
                data: [
                    ['投资人',56],
                    ['创始团队',12],
                    ['员工持股',32]
                ]
            }],


            //Title configuration (optional)
            title: {
                text: ''
            }
        };
    });

