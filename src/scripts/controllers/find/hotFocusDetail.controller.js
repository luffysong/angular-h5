var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('HotFocusDetailController', HotFocusDetailController);

function HotFocusDetailController(loading, FindService, ErrorService, $stateParams) {
    var vm = this;
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
            tickColor: '#5A626D',
            tickPosition: 'inside',
            tickLength: 4,
            tickmarkPlacement: 'on',
            categories: [],
        },
        yAxis: {
            title: null,
            min: 0,
            gridLineColor: '#F2F4F5',
            gridLineDashStyle: 'Long dashes',
        },
        series: [{
            type: 'area',
            name: '热度',
            data: [],
        }],
    };

    // 图表 2 配置
    vm.chartConfig2 = {
        options: {
            chart: {
                type: 'bar',
                height: 250,
            },
            legend: {
                enabled: false,
            },
        },
        title: {
            text: null,
        },
        xAxis: {
            categories: [],
            title: null,
        },
        yAxis: {
            title: null,
        },
        series: [{
            name: '搜索量',
            data: [],
        },],
    };

    // URL 信息
    vm.params = {
        id: $stateParams.id,
        eventEnum: $stateParams.eventEnum,
        intervalEnum: $stateParams.intervalEnum,
        title: decodeURIComponent($stateParams.title),
    };

    // 页面初始化
    init();
    loading.show('hotFocusDetailLoading');

    function init() {
        FindService.getHotFocusDetail(vm.params.id, {
            eventEnum: vm.params.eventEnum,
            intervalEnum: vm.params.intervalEnum,
        }).then(function(response) {
            loading.hide('hotFocusDetailLoading');
            if (response.data) {
                if (response.data.data) {
                    vm.chartConfig1.series[0].data = response.data.data.reverse().slice(1);
                }
                vm.chartConfig1.xAxis.categories = generateDates();
                vm.detailData = angular.copy(response.data);
            }
        }).catch(error);
    }

    function generateDates() {
        var dateArr = [];
        var interval = '';

        switch (vm.params.intervalEnum) {
            case 'DAY':
                interval = 'days';
                break;
            case 'WEEK':
                interval = 'weeks';
                break;
            case 'MONTH':
                interval = 'months';
                break;
            default:
                interval = 'days';
        }
        for (var i = 0; i < 6; i++) {
            dateArr.push(moment().subtract(i, interval).format('MM/DD'));
        }
        return dateArr.reverse();
    }

    function error(err) {
        loading.hide('hotFocusDetailLoading');
        ErrorService.alert(err);
    }
}
