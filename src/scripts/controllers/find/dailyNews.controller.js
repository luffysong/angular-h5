var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('DailyNewsController', DailyNewsController);

function DailyNewsController(loading, FindService, ErrorService, hybrid, $timeout, versionService, $rootScope, $timeout,
    $state) {
    var vm = this;
    $('body').css({
        backgroundColor: '#fff'
    });
    window.scrollTo(0, 0);

    vm.responseData = [];
    vm.ts = '';
    vm.busy = false;
    vm.loadMore = loadMore;
    vm.link = link;
    vm.openNativePage = openNativePage;

    vm.sendData = {
        industrys: '',
        websites: '',
        ts: ''
    };
    vm.filter = filter;
    vm.filterDismiss = filterDismiss;
    vm.rollBack = rollBack;
    vm.submit = submit;
    vm.displayFlag = false;

    vm.itemFlagClick = itemFlagClick;
    vm.setShowFlag = setShowFlag;
    vm.showMoreFlag = 8;
    vm.sendflagArray = [];
    vm.flagArrayAll = [];

    vm.itemSourceClick = itemSourceClick;
    vm.setShowSource = setShowSource;
    vm.showMoreSource = 8;
    vm.sendSourceArray = [];
    vm.sourceArrayAll = [];
    vm.sourceArray = [];

    vm.clickNews = function (evtName, obj, item) {
        sa.track('ClickNews', {
            target: 'news',
            company_id: item.ccid,
            news_id: item.id,
            news_url: item.link,
            news_index: obj.news_index
        });
        if (item.hasContent) {
            $state.go('find.newsDetail', {
                id: item.id
            });
        } else {
            vm.link(item.ccid, item.link);
        }
    };

    init();

    function init() {
        document.title = '媒体热议';
        $('head').append('<meta name="format-detection" content="telephone=no" />');
        if (localStorage.getItem('dailyNewsTime') && localStorage.getItem('dailyNewsTime') !== 'undefined') {
            var nowTime = (new Date()).getTime();
            var interval = nowTime - localStorage.getItem('dailyNewsTime');
            if (interval > 5 * 60 * 1000) {
                localStorage.setItem('dailyNewsTime', '');
                localStorage.setItem('dailyNewsData', '');
            }
            //console.log(nowTime);
        } else {
            localStorage.setItem && localStorage.setItem('dailyNewsTime', JSON.stringify((new Date()).getTime()));
            //console.log('test');
        }
        if (localStorage.getItem('dailyNewsData') && localStorage.getItem('dailyNewsData') !== 'undefined') {
            vm.sendSourceArray = JSON.parse(localStorage.getItem('dailyNewsData')).sendSourceArray;
            vm.sendflagArray = JSON.parse(localStorage.getItem('dailyNewsData')).sendflagArray;
            vm.sourceArrayAll = JSON.parse(localStorage.getItem('dailyNewsData')).sourceArrayAll;
            vm.flagArrayAll = JSON.parse(localStorage.getItem('dailyNewsData')).flagArrayAll;
        }
        loadData();
        initWeixin();
        getFlagData(vm.flagArrayAll); //页面加载获得接口标签
        getSourceData(vm.sourceArrayAll); //页面加载获得接口来源
    }

    function initWeixin() {
        window.WEIXINSHARE = {
            shareTitle: '媒体热议',
            shareUrl: window.location.href,
            shareImg: 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png',
            shareDesc: '来「36氪创投助手」，发现最新最热优质项目！',
            shareButton: 'hide'
        };
        var obj = {};
        window.InitWeixin(obj);
    }

    function loadData() {
        loading.show('findLoading');
        setSendData();
        vm.dailyNewsData = {
            sendSourceArray: vm.sendSourceArray,
            sendflagArray: vm.sendflagArray,
            sourceArrayAll: vm.sourceArrayAll,
            flagArrayAll: vm.flagArrayAll
        }
        localStorage.setItem && localStorage.setItem('dailyNewsData', JSON.stringify(vm.dailyNewsData));
        FindService.getDailyReport(vm.sendData)
            .then(function temp(response) {
                vm.responseData = generateTime(response.data.data);
                vm.ts = response.data.ts;
                vm.sendData.ts = response.data.ts;
                vm.busy = false;
                vm.hasInit = true;
                loadMore();
                loading.hide('findLoading');
                loading.hide('dailyNewsLoading');
            })
            .catch(error);
    }

    function generateTime(data) {
        return data.map(function (item) {
            var displayTimeStr = item.displayTimeStr;
            var displayTime = '';
            var arr = displayTimeStr.split('/');
            if (arr.length == 2) {
                displayTime += arr[0].replace(/^0/, '') + '月';
                displayTime += arr[1].replace(/^0/, '') + '日';
            } else if (arr.length == 3) {
                displayTime += arr[0].replace(/^0/, '') + '年';
                displayTime += arr[1].replace(/^0/, '') + '月';
                displayTime += arr[2].replace(/^0/, '') + '日';
            } else {
                displayTime = displayTimeStr;
            }
            item.displayTime = displayTime;
            return item;
        });
    }

    function loadMore() {
        if (vm.busy) return;
        vm.busy = true;
        if (!vm.ts) {
            return;
        }
        FindService.getDailyReport(vm.sendData)
            .then(function temp(response) {
                $timeout(function () {
                    vm.responseData = vm.responseData.concat(generateTime(response.data.data));
                    vm.ts = response.data.ts;
                    vm.sendData.ts = response.data.ts;
                    vm.busy = false;
                }, 500);
            })
            .catch(error);
        sa.track('More', {
            page: 'news_list',
        });
    }

    function error(err) {
        ErrorService.alert(err);
    }

    function link(ccid, link) {
        hybrid.open('addBottomViewInWeb/' + ccid);
        window.location.href = link;
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


    function getFlagData(arr) {
        if (!arr.length) {
            FindService.getIndustry()
                .then(function temp(response) {
                    vm.flagArray = response.data.industrys;
                    var object;
                    vm.flagArrayAll = [{
                        active: true,
                        label: '全部',
                        id: 0
                    }];
                    for (var i = 0; i < vm.flagArray.length; i++) {
                        object = {
                            active: false,
                            label: vm.flagArray[i].name,
                            id: vm.flagArray[i].id,
                        };
                        vm.flagArrayAll.push(object);
                    }
                })
                .catch(error);
        }
    }

    function getSourceData(arr) {
        if (!arr.length) {
            FindService.getWebsite()
                .then(function temp(response) {
                    vm.sourceArray = response.data.websites;
                    var object;
                    vm.sourceArrayAll = [{
                        active: true,
                        label: '全部',
                        id: 0
                    }];
                    for (var i = 0; i < vm.sourceArray.length; i++) {
                        object = {
                            active: false,
                            label: vm.sourceArray[i].name,
                            id: vm.sourceArray[i].id
                        };
                        vm.sourceArrayAll.push(object);
                    }
                })
                .catch(error);
        }
    }

    function filter(e) {
        e.preventDefault();
        vm.displayFlag = true;
        $('html, body').css({
            overflow: 'hidden'
        });
        //if (localStorage.getItem('dailyNewsData') && localStorage.getItem('dailyNewsData') !== 'undefined') {
        //    vm.sourceArrayAll = JSON.parse(localStorage.getItem('dailyNewsData')).sourceArrayAll;
        //    vm.flagArrayAll = JSON.parse(localStorage.getItem('dailyNewsData')).flagArrayAll;
        //}
        $timeout(function () {
            filterCount();
        }, 0);
    }

    function filterDismiss(e) {
        e.preventDefault();
        vm.displayFlag = false;
        $timeout(function () {
            if (!vm.sendflagArray.length && !vm.sendSourceArray.length) {
                loadData();
            }
        }, 300);
        $('html, body').css({
            overflow: ''
        });
    }

    function rollBack() {
        for (var i = 1; i < vm.flagArrayAll.length; i++) {
            vm.flagArrayAll[i].active = false;
        }
        vm.flagArrayAll[0].active = true;
        vm.sendflagArray = [];

        for (var i = 1; i < vm.sourceArrayAll.length; i++) {
            vm.sourceArrayAll[i].active = false;
        }
        vm.sourceArrayAll[0].active = true;
        vm.sendSourceArray = [];
        filterCount();
    }

    function submit() {
        $('html, body').css({
            overflow: ''
        });
        vm.displayFlag = false;
        loadData();
    }

    function setSendData() {
        if (!vm.sendflagArray.length && !vm.sendSourceArray.length) {
            vm.sendData = {
                industrys: '',
                websites: '',
                ts: ''
            };
        } else if (!vm.sendflagArray.length && vm.sendSourceArray.length) {
            vm.sendData = {
                industrys: '',
                websites: vm.sendSourceArray.join(','),
                ts: ''
            };
        } else if (vm.sendflagArray.length && !vm.sendSourceArray.length) {
            vm.sendData = {
                industrys: vm.sendflagArray.join(','),
                websites: '',
                ts: ''
            };
        } else {
            vm.sendData = {
                industrys: vm.sendflagArray.join(','),
                websites: vm.sendSourceArray.join(','),
                ts: ''
            };
        }
    }
    //筛选数目统计
    function filterCount() {
        setSendData();
        FindService.getFilterSourceFlagCount(vm.sendData)
            .then(function temp(response) {
                vm.proNum = response.data.data;
            })
            .catch(error);
    }

    function itemFlagClick(item, e) {
        vm.sendflagArray = [];
        e.preventDefault();
        if (item.label === '全部') {
            for (var i = 1; i < vm.flagArrayAll.length; i++) {
                vm.flagArrayAll[i].active = false;
            }
            vm.flagArrayAll[0].active = true;
        } else {
            vm.flagArrayAll[0].active = false;
            item.active = !item.active;
            for (var j = 0; j < vm.flagArrayAll.length; j++) {
                if (vm.flagArrayAll[j].active === true) {
                    vm.sendflagArray.push(vm.flagArrayAll[j].id);
                }
            }
            if (!vm.sendflagArray.length) {
                vm.flagArrayAll[0].active = true;
            }
        }
        filterCount();
    }

    function setShowFlag() {
        vm.showMoreFlag = vm.showMoreFlag == 8 ? vm.flagArrayAll.length : 8;
    }

    function itemSourceClick(item, e) {
        vm.sendSourceArray = [];
        e.preventDefault();
        if (item.label === '全部') {
            for (var i = 1; i < vm.sourceArrayAll.length; i++) {
                vm.sourceArrayAll[i].active = false;
            }
            vm.sourceArrayAll[0].active = true;
        } else {
            vm.sourceArrayAll[0].active = false;
            item.active = !item.active;
            for (var j = 0; j < vm.sourceArrayAll.length; j++) {
                if (vm.sourceArrayAll[j].active === true) {
                    vm.sendSourceArray.push(vm.sourceArrayAll[j].id);
                    //vm.sendSourceArray.push(j);
                }
            }
            if (!vm.sendSourceArray.length) {
                vm.sourceArrayAll[0].active = true;
            }
        }
        filterCount();
    }

    function setShowSource() {
        vm.showMoreSource = vm.showMoreSource == 8 ? vm.sourceArrayAll.length : 8;
    }
}
