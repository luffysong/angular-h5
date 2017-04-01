var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('DailyNewsController', DailyNewsController);

function DailyNewsController(loading, FindService, ErrorService, hybrid, $timeout, versionService) {
    var vm = this;
    $('body').css({
        backgroundColor: '#fff'
    });

    vm.responseData = [];
    vm.ts = '';
    vm.busy = false;
    vm.loadMore = loadMore;
    vm.link = link;
    vm.openNativePage = openNativePage;

    vm.sensorsTrack = function(evtName, obj) {
        vm.link(obj.company_id, obj.news_url);
    };

    init();

    function init() {
        document.title = '媒体热议';
        $('head').append('<meta name="format-detection" content="telephone=no" />');

        loadData();
        initWeixin();
    }

    function initWeixin() {
        window.WEIXINSHARE = {
            shareTitle: '每日报道',
            shareUrl: window.location.href,
            shareImg: 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png',
            shareDesc: '来「36氪创投助手」，发现最新最热优质项目！',
            shareButton: 'hide'
        };
        var obj = {};
        window.InitWeixin(obj);
    }

    function loadData() {
        FindService.getDailyReport(vm.ts)
            .then(function temp(response) {
                vm.responseData = generateTime(response.data.data);
                vm.ts = response.data.ts;
                vm.busy = false;
                vm.hasInit = true;
                loading.hide('findLoading');
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

        FindService.getDailyReport(vm.ts)
            .then(function temp(response) {
                $timeout(function() {
                    vm.responseData = vm.responseData.concat(generateTime(response.data.data));
                    vm.ts = response.data.ts;
                    vm.busy = false;
                }, 500);
            })
            .catch(error);
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
}
