var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('IndustryReportListController', IndustryReportListController);

function IndustryReportListController(FindService, ErrorService, loading, hybrid) {
    var vm = this;
    vm.reportList = [];
    document.title = '行业报告';
    vm.loadMore = loadMore;
    vm.reportLink = reportLink;
    vm.openNativePage = openNativePage;
    vm.doSearch = doSearch;
    vm.keyword = '';
    vm.busy = false;
    vm.dataItemLength = '';
    vm.endLoading = true;
    init();
    function init() {
        window.WEIXINSHARE = {
            shareButton: 'hide'
        };
        vm.sendData = {
            keyword: vm.keyword,
            pageSize: 20,
            page: 1
        };
        vm.loadMore();
    }

    function loadMore() {
        if (vm.busy) {
            return;
        }

        vm.busy = true;

        FindService.getIndustryReportList(vm.sendData).then(function (data) {
            var responseObj = data.data;
            loading.hide('industryReportListLoading');
            vm.dataItemLength = responseObj.data.length;
            if (!vm.dataItemLength) {
                vm.busy = true;
                vm.endLoading = false;
                return;
            }

            if(!vm.reportList) {
                vm.reportList = responseObj.data;
            } else {
                vm.reportList = vm.reportList.concat(responseObj.data);
            }

            vm.sendData.page = responseObj.page + 1;
            vm.busy = false;
            window.setTimeout(function () {
                if(vm.keyword.length > 0) {
                    var body = $('#block-part-con');
                    body.highlight(vm.keyword);
                }
            }, 0);
        }).catch(function (err) {
            loading.hide('industryReportListLoading');
            if (err && err.data) {
                ErrorService.alert(err.data);
            }
        });
    }

    function reportLink(cell, event) {
        event.stopPropagation();
        if (cell.attachLink) {
            window.location.href = cell.attachLink;
            // path = '/openEncryptionLink/' + encodeURIComponent(cell.attachLink);
            // openNativePage(path);
        } else {
            window.location.href = cell.link;
            // path = '/openEncryptionLink/' + encodeURIComponent(cell.link);
            // openNativePage(path);
        }
        // a href="{{cell.attachLink}}" target="_blank"
    }
    function openNativePage(path) {
        console.log(path);
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
    function doSearch(e) {
        // e.preventDefault();
        vm.busy = false;
        vm.dataItemLength = '';
        vm.endLoading = true;
        vm.reportList = [];
        vm.sendData = {
            keyword: vm.keyword,
            pageSize: 20,
            page: 1
        };
        console.log(1);
        vm.loadMore();
    };
}
