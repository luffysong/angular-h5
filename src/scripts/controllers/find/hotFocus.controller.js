var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('HotFocusController', HotFocusController);

function HotFocusController(loading, ErrorService, FindService, $stateParams, $state) {
    var vm = this;
    document.title = '关注热点';
    $('body').css({backgroundColor: '#fff'});

    window.WEIXINSHARE = '';

    // URL 信息
    vm.params = {
        eventEnum: $stateParams.eventEnum || 'SEARCH',
        intervalEnum: $stateParams.intervalEnum || 'DAY',
    };

    // 对应话术
    var phrases = {
        eventEnum: {
            TALK: '约谈',
            FOCUS: '收藏',
            SEARCH: '搜索',
        },
        intervalEnum: {
            DAY: '今天',
            WEEK: '近一周',
            MONTH: '近一个月',
        },
    };

    // 列表信息
    vm.focusList = [];

    // 筛选
    vm.goToSee = goToSee;

    // 查看详情
    vm.goToDetail = goToDetail;

    // 页面初始化
    loading.show('hotFocus');
    init();

    function init() {
        FindService.getHotFocus({
            eventEnum: vm.params.eventEnum,
            intervalEnum: vm.params.intervalEnum,
        }).then(function(response) {
            loading.hide('hotFocus');
            if (response.data) {
                var structuredData = response.data.map(function(item) {
                    item.structuredTitle = generateTitle(item.name, item.signal);
                    return item;
                });
                vm.focusList = structuredData;
            }
        }).catch(error);
    }

    function error(err) {
        ErrorService.alert(err);
        loading.hide('hotFocus');
    }

    // 条件筛选
    function goToSee(params) {
        if (params.eventEnum) {
            vm.params.eventEnum = params.eventEnum;
        }
        if (params.intervalEnum) {
            vm.params.intervalEnum = params.intervalEnum;
        }
        $state.go('find.hotFocus', vm.params);
    }

    // 查看详情
    function goToDetail(cid, title) {
        vm.params.id = cid;
        vm.params.title = encodeURIComponent(title);
        $state.go('find.hotFocusDetail', vm.params);
    }

    // 根据信号生成标题
    function generateTitle(name, signal) {
        var title = '';
        var extraData = JSON.parse(signal.extraData);
        var signalType = signal.signalType.split('.');
        var increase = 0;
        var extra = '';

        increase = extraData.to - extraData.from;
        title += phrases.intervalEnum[vm.params.intervalEnum];
        title += phrases.eventEnum[vm.params.eventEnum];

        if (signalType.indexOf('great') > -1) {
            extra = '量达到' + extraData.to;
        } else if (signalType.indexOf('increase') > -1) {
            extra = '增加' + increase + '次';
        }

        return title + extra;
    }
}
