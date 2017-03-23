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
                type: 'line',
            },
        },
        title: {
            text: '同比增长',
        },
        xAxis: {
            categories: ['二月', '三月', '四月', '五月', '六月', '七月', '八月'],
        },
        yAxis: {
            title: null,
        },
        series: [{
            name: '增长',
            data: [10, 13, 25, 3, 8, 30, 15],
        }],
        legend: {
            enabled: false,
        },
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
