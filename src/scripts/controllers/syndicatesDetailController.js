/**
 * Controller Name: ApplyProvisionController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesDetailController',
    function($scope, UserService, $modal, ErrorService, $stateParams,DictionaryService,CrowdFundingService,notify,CompanyService) {
        console.log($stateParams);

        /*获取众筹详情*/
        CrowdFundingService["crowd-funding"].get({
            id:$stateParams.fundingId
        },function(data){
            console.log(data);
            $scope.syndicatesInfo = data;
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
        //股权结构
        $scope.stockStructure = {};
        $scope.chartConfig = {

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
                        size:"75%",
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

