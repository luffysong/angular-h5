var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('IndustryReportListController', IndustryReportListController);

function IndustryReportListController(FindService, ErrorService, loading, hybrid) {
    var vm = this;
    vm.reportList = [];
    document.title = '行研报告';
    vm.loadMore = loadMore;
    vm.reportLink = reportLink;
    vm.reportPdfLink = reportPdfLink;
    vm.searchFocus = searchFocus;
    vm.searchBlur = searchBlur;
    vm.openNativePage = openNativePage;
    vm.doSearch = doSearch;
    vm.keyword = '';
    vm.busy = false;
    vm.dataItemLength = '';
    vm.endLoading = true;
    // vm.isJump = true; //默认可以跳转
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
        window.location.href = cell.link;
    }
    function reportPdfLink(cell, event) {
        event.stopPropagation();
        window.location.href = cell.attachLink;
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
        e.preventDefault();
        vm.busy = false;
        vm.dataItemLength = '';
        vm.endLoading = true;
        vm.reportList = [];
        vm.sendData = {
            keyword: vm.keyword,
            pageSize: 20,
            page: 1
        };
        $('#block-part-con').css("opacity","1");
        // vm.isJump = true;
        vm.loadMore();
    };
    function searchFocus(e) {
        e.preventDefault();
        vm.reportList = [];
        // vm.isJump = false;
        // $('#block-part-con').css("opacity","0.05");
    }
    function searchBlur(e) {
        e.preventDefault();
        // vm.isJump = true;
        // $('#block-part-con').css("opacity","1");
    }
}
