/**
 * Controller Name: ApplyProvisionController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesDetailController',
    function($scope, UserService, $modal, ErrorService, $stateParams,DictionaryService,CrowdFundingService,notify,CompanyService) {
        /*获取用户是否为跟投人*/
        UserService.getIdentity(function(data){
            console.log(data);
            if(data){
                $scope.isCoInvestor = data.coInvestor ? true : false;
            }else{
                $scope.isCoInvestor = false;
            }
        });
        /*股权结构是否出错*/
        $scope.shareError = false;
        /*众筹信息是否全部展开*/
        $scope.isToggle = false;
        $scope.coInvestor = {};
        $scope.fundingId = $stateParams.fundingId;
        $scope.companyId = $stateParams.companyId;
        /*是否展示全部跟投人*/
        $scope.showAll = false;
        /*公司众筹状态*/
        $scope.status = $stateParams.status;
        /*获取公司基本信息*/
        CompanyService.get({
            id:$scope.companyId
        },function(data){
            $scope.companyData = data;
            console.log(data);
        },function(err){
            ErrorService.alert(err);
        });
        /*获取众筹详情*/
        CrowdFundingService["crowd-funding"].get({
            id:$scope.fundingId
        },function(data){
            console.log(data);
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
            console.log(data);
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

        /*获取跟投人列表*/
        CrowdFundingService.query({
            "model":"crowd-funding",
            "id":$scope.fundingId,
            "submodel":"co-investors"
        },function(data){
            console.log(data);
            $scope.coInvestorData = data.data;
            if($scope.coInvestorData.length > 8){
                $scope.tempList = $scope.coInvestorData.concat().slice(0,8);
            }else{
                $scope.showAll = true;
            }
            $scope.coInvestor.hasPermisson = true;
        },function(err){
            console.log(err);
            if(err.code == 401){
                $scope.coInvestor.hasPermisson = false;
            }else{
                ErrorService.alert(err);
            }
        });
        /*查看全部跟投人*/
        $scope.loadInvestor = function(){
            $scope.showAll = true;
        };
        /*展开更多众筹信息*/
        $scope.toggleMore = function(){
            $scope.isToggle = true;
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

