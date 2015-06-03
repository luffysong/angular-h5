/**
 * Controller Name: ApplyProvisionController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesDetailController',
    function($scope, UserService, $modal, ErrorService, $stateParams,DictionaryService,CrowdFundingService,notify) {
        console.log($stateParams);


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

