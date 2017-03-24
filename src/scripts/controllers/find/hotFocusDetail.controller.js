var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('HotFocusDetailController', HotFocusDetailController);

function HotFocusDetailController(loading) {
    var vm = this;
    loading.hide('findLoading');
    // 页面 title
    document.title = '热点详情';
    // 图表 1 配置
    vm.chartConfig1 = {
        options: {
            chart: {
                height: 250,
            },
            legend: {
                enabled: false,
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, 'rgba(231, 239, 243, 0.35)'],
                            [1, 'rgba(231, 239, 243, 0.50)']
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 2,
                    pointPlacement: 'on',
                    lineColor: '#5A626D',
                    states: {
                        hover: {
                            lineWidth: 2,
                        }
                    },
                    threshold: null
                },
                series: {
                    marker: {
                        fillColor: '#5A626D',
                    },
                },
            },
            tooltip: {
                backgroundColor: '#222C38',
                borderRadius: 4,
                borderWidth: 0,
                style: {
                    fontSize: '13px',
                    color: '#fff',
                    lineHeight: '16px',
                    padding: '6px 14px',
                },
                padding: 14,
                shadow: false,
                useHTML: true,
            },
        },
        title: {
            text: null,
        },
        xAxis: {
            title: null,
            lineColor: '#F2F4F5',
            gridLineColor: '#F2F4F5',
            gridLineDashStyle: 'dashed',
            categories: ['二月', '三月', '四月', '五月', '六月', '七月', '八月'],
        },
        yAxis: {
            title: null,
            lineColor: '#F2F4F5',
            gridLineColor: '#F2F4F5',
            gridLineDashStyle: 'dashed',
        },
        series: [{
            type: 'area',
            name: '热度',
            data: [10, 13, 25, 3, 8, 30, 15],
        }],
    };
    // 图表 2 配置
    vm.chartConfig2 = {
        options: {
            chart: {
                type: 'bar',
            },
        },
        title: {
            text: '竞品搜索量排行',
        },
        xAxis: {
            categories: ['36氪', '3W coffee', 'IT 橘子'],
            title: null,
        },
        yAxis: {
            title: null,
        },
        series: [{
            name: '搜索量',
            data: [10, 8, 6],
        },],
    };
}
