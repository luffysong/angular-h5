var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('HotFocusDetailController', HotFocusDetailController);

function HotFocusDetailController(loading, FindService, ErrorService, $stateParams, hybrid, versionService) {
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
                        lineWidth: 1,
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
            gridLineDashStyle: 'longdashdot',
        },
        series: [{
            type: 'area',
            name: '热度',
            data: [],
        }],
    };

    // URL 信息
    vm.params = {
        id: $stateParams.id,
        eventEnum: $stateParams.eventEnum,
        intervalEnum: $stateParams.intervalEnum,
        title: decodeURIComponent($stateParams.title),
    };

    // 对应话术
    var phrases = {
        eventEnum: {
            TALK: '约谈',
            FOCUS: '关注',
            SEARCH: '搜索',
        },
    };

    // 打开本地公司页面
    vm.openNativePage = openNativePage;

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
                    vm.chartConfig1.series[0].name = phrases.eventEnum[vm.params.eventEnum];
                }
                vm.chartConfig1.xAxis.categories = generateDates();
                vm.detailData = angular.copy(response.data);
                vm.detailData.companyCompetitors = generatePercents(response.data.companyCompetitors);
            }
        }).catch(error);
        vm.event = phrases.eventEnum[vm.params.eventEnum];
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

    function generatePercents(competitors) {
        var max = 0;
        var percent = 0;

        for (var i = 0, len = competitors.length; i < len; i++) {
            var dataSum = competitors[i].dataSum;
            if (dataSum > max) {
                max = dataSum;
            }
        }

        return competitors.map(function(item) {
            percent = (item.dataSum * 100 / max + 2).toFixed(2);
            item.percent = item.dataSum > 0 ? percent : 2;
            return item;
        });
    }

    function error(err) {
        loading.hide('hotFocusDetailLoading');
        ErrorService.alert(err);
    }

    function openNativePage(path) {
        if (hybrid.isInApp) {
            if (path.substring(1, 11) === 'crmCompany') {
                //2.6.2以下版本兼容
                var versionTou = versionService.getVersionAndroid() || versionService.getVersionIOS();
                if (versionTou && (versionService.cprVersion(versionTou, '2.6.2') === 0)) {
                    var satrtNum = path.indexOf('?');
                    path = path.replace(path.substring(satrtNum), '');
                }
            }

            hybrid.open(path);
        }
    }
}
