/**
 * Controller Name: ApplyProvisionController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesDetailController',
    function($scope, UserService, $modal, ErrorService, $stateParams,DictionaryService,CrowdFundingService,notify,CompanyService,$timeout,$state,$rootScope) {
        var statusList = DictionaryService.getDict("crowd_funding_status");

        /*股权结构是否出错*/
        $scope.shareError = false;
        /*众筹信息是否全部展开*/
        $scope.isToggle = false;
        $scope.showAll = false;
        $scope.coInvestor = {};
        $scope.fundingId = $rootScope.fundingId = $stateParams.fundingId;

        $scope.companyId = $rootScope.companyId = $stateParams.companyId;
        document.title="36氪众筹";
        $scope.skip = {
            url:""
        };
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
                if(data.coInvestor){
                    $scope.isCoInvestor = true;
                }else{
                    $scope.isCoInvestor = false;
                    $scope.skip.url = $scope.rongHost+"/m/#/investorValidate";
                }
            }else{
                $scope.isCoInvestor = false;
                $scope.skip.url = $scope.rongHost+"/m/#/investorValidate";
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
            //console.log(data);
            $scope.color = data.base.status;
            $scope.syndicatesInfo = data;
            if($scope.syndicatesInfo.co_investors){
                if($scope.syndicatesInfo.co_investors.length > 8){
                    $scope.tempData = angular.copy($scope.syndicatesInfo.co_investors);
                    $scope.syndicatesInfo.co_investors = $scope.syndicatesInfo.co_investors.slice(0,8);
                }else{
                    $scope.tempData = angular.copy($scope.syndicatesInfo.co_investors);
                    $scope.showAll = true;
                }
            }
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

            if($scope.syndicatesInfo.base){
                $scope.syndicatesInfo.base.percent = parseInt($scope.syndicatesInfo.base.cf_success_raising) * 100 / parseInt($scope.syndicatesInfo.base.cf_raising);
                /*
                 停止投资三种情况：
                 1.众筹超时
                 2.剩余投资金额不足
                 3.跟投人达到最多跟投人数
                 * */
                if(new Date($scope.syndicatesInfo.base.end_time) < new Date()){
                    $scope.timeout = true;
                }
                if($scope.syndicatesInfo.base.min_investment && $scope.syndicatesInfo.base.min_investment > $scope.syndicatesInfo.base.cf_max_raising - $scope.syndicatesInfo.base.cf_success_raising){
                    $scope.timeout = true;
                }
            }
            if($scope.syndicatesInfo.co_investors && $scope.syndicatesInfo.base.max_coinvestor_number <= $scope.syndicatesInfo.co_investors.length){
                $scope.timeout = true;
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

        $scope.loadInvestor = function(){
            $scope.syndicatesInfo.co_investors = $scope.tempData;
            $scope.showAll = true;
        }
        /*展开更多众筹信息*/
        $scope.toggleMore = function(){
            $scope.isToggle = true;
        }
        /*底部栏点击我要投资*/
        $scope.toInvest = function(){
            $state.go("syndicatesConfirm");
            /*$modal.open({
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
            });*/
        }
        /*开投提醒*/
        $scope.krCode = function(){
            if(!UserService.getUID()){
                location.href = "/user/login?from=" + encodeURIComponent(location.href);
                return;
            }else if(!$scope.isCoInvestor){
                $state.go("investorValidate");
            }else{
                $state.go("syndicatesConfirm",{
                    cid:$scope.companyData.company.id,
                    fundingId:$scope.fundingId
                });
            }
        }
        $scope.wantInvest = function(event){
            if(!$scope.isCoInvestor){
                event.preventDefault();
                $state.go("investorValidate");
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

