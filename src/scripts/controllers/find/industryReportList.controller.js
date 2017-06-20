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
    vm.doCancel = doCancel;
    vm.doSubmit = doSubmit;
    vm.keyword = '';
    vm.busy = false;
    vm.dataItemLength = '';
    vm.endLoading = true;
    vm.searchKey = '搜索';
    var isIos = !!navigator.userAgent.match(/iphone|ipod|ipad/ig);
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
        $("body").css('background-color', '#f9f9f9');
        if (vm.busy) {
            return;
        }

        vm.busy = true;

        FindService.getIndustryReportList(vm.sendData).then(function (data) {
            var responseObj = data.data;
            loading.hide('industryReportListLoading');
            vm.dataItemLength = responseObj.data && responseObj.data.length;
            if (!vm.dataItemLength) {
                vm.busy = true;
                vm.endLoading = false;
                if (!vm.reportList.length) {
                    $("body").css('background-color', '#fff');
                }
                return;
            }
            if (responseObj.totalPages - vm.sendData.page < 0) {
                vm.busy = true;
                vm.endLoading = false;
                vm.dataItemLength = 0;
                if (!vm.reportList.length) {
                    $("body").css('background-color', '#fff');
                }
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
            if (vm.reportList.length < 10) {
                vm.loadMore();
            }
        }).catch(function (err) {
            loading.hide('industryReportListLoading');
            if (err && err.data) {
                ErrorService.alert(err.data);
            }
        });
    }

    function reportLink(cell, event) {
        event.stopPropagation();
        // window.open(cell.link);
        // window.location.href = cell.link;
        // vm.reportList = [];
        // vm.endLoading = true;
        hybrid.open('openEncryptionLink/' + encodeURIComponent(cell.link));
        $("body").css('background-color', '#fff');
    }
    function reportPdfLink(cell, event) {
        event.stopPropagation();
        // window.open(cell.attachLink);
        // vm.reportList = [];
        // vm.endLoading = true;
        hybrid.open('openEncryptionLink/' + encodeURIComponent(cell.attachLink));
        $("body").css('background-color', '#fff');
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
    function doCancel(e) {
        e.preventDefault();
        vm.keyword = '';
        vm.doSubmit(e);
    }    
    function doSubmit(e) {
        e.preventDefault();
        document.activeElement.blur();
        vm.searchKey = '搜索';
        vm.busy = false;
        vm.dataItemLength = '';
        vm.endLoading = true;
        vm.reportList = [];
        vm.sendData = {
            keyword: vm.keyword,
            pageSize: 20,
            page: 1
        };
        vm.loadMore();
    }
    function searchFocus(e) {
        e.preventDefault();
        $('#block-part-con').css("display", "none");
        vm.reportList = [];
        // vm.endLoading = true;
        vm.searchKey = '取消';
        if (isIos) {
            $('.block-part-div').css("position", "relative");
        }
    }
    function searchBlur(e) {
        e.preventDefault();
        // vm.searchKey = '搜索';
        $('#block-part-con').css("display", "block");
        $('.block-part-div').css("position", "fixed");
        vm.reportList = [];vm.endLoading = true;
    }
}
