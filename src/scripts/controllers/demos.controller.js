
var  angular = require('angular');
angular.module('defaultApp.controller')
.controller('DemosController', DemosController);

function DemosController(demosService, projectColumnService,
    $state, $stateParams, cover, loading, ErrorService) {
    var vm = this;
    var COLUMN = 'column';

    vm.id = $stateParams.id;
    vm.busy = true;
    vm.demos = [];
    vm.type = $stateParams.type;
    vm.needPwd = false;

    vm.isColumn = isColumn;
    vm.goProjects = goProjects;
    vm.getCollectionType = getCollectionType;
    vm.vadliateAndGetDemos = vadliateAndGetDemos;
    vm.loadMore = loadMore;
    init();
    function init() {
        document.removeEventListener('touchmove', function () {
            console.log('touchmove');
        });

        $('html').css('overflow', 'auto');
        $('body').css('overflow', 'auto');
        if (isColumn()) {
            loadColumnDetail(0);
        }else {
            vm.shareImgSave = cover.imgUrl;
            if (cover.type !== 'NORMAL') {
                cover.imgUrl = 'https://pic.36krcnd.com/avatar/201611/11051619/zesbckdrckkkgh27.jpg';
            }

            loadCollectionDetail(0);
        }

        renderCover(cover);
        initWeixin(cover);
        loading.hide('demos');
    }

    function initWeixin(data) {
        document.title = data.name || data.proSetName;
        window.WEIXINSHARE = {
            shareTitle: data.name || data.proSetName,
            shareUrl: window.location.href,
            shareImg: data.sharePic || vm.shareImgSave  || 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png',
            shareDesc: '来「36氪创投助手」，发现最新最热优质项目！'
        };
        var obj = {};
        obj.timelineSuccess = function timelineSuccess() {
            if (vm.isColumn()) {
                krtracker('trackEvent', 'click', 'h5.demosColumn.shareTimeline');
            } else {
                krtracker('trackEvent', 'click', 'h5.demosProjects.shareTimeline');
            }

        };

        obj.appMessageSuccess = function appMessageSuccess() {
            if (vm.isColumn()) {
                krtracker('trackEvent', 'click', 'h5.demosColumn.shareAppMessage');
            } else {
                krtracker('trackEvent', 'click', 'h5.demosProjects.shareAppMessage');
            }
        };

        window.InitWeixin(obj);
    }

    function vadliateAndGetDemos() {
        vm.inputPwd = true;
        demosService.getDemos($stateParams.id, vm.password, 0)
            .then(renderList)
            .catch(invalidate);
    }

    function renderCover(cover) {
        if (!isColumn()) {
            cover = convertCover(cover);
        }

        vm.cover = cover;
        if (vm.cover.intro) {
            vm.cover.intro = '介绍：' + vm.cover.intro;
        }
    }

    function convertCover(cover) {
        var coverCopy = {};
        coverCopy.proSetCount = cover.proSetCount;
        coverCopy.name = cover.proSetName;
        coverCopy.intro = cover.fetchCode;
        coverCopy.headPic = cover.imgUrl;
        return coverCopy;
    }

    function isColumn() {
        return vm.type === COLUMN;
    }

    function loadCollectionDetail(ts) {
        demosService.getDemos($stateParams.id, '', ts)
        .then(renderList)
        .catch(error);
    }

    function loadColumnDetail(ts) {
        projectColumnService.getDetail($stateParams.id, ts)
            .then(renderList);
    }

    function goProjects(id) {
        $state.go('demos', {
            id: id,
            type: 'projects'
        }, { reload: true });
    }

    function renderList(data) {

        if (isColumn()) {
            renderColumnDetail(data);
            if (data.totalPages) {
                vm.page = data.page || 0;
                if (data.totalPages !== vm.page) {
                    vm.busy = false;
                } else {
                    vm.finish = true;
                }
            }
        }else {
            renderCollectionDetail(data);
            if (data.valid) {
                vm.ts = data.ts || 0;
                if (data.data.cells.length) {
                    vm.busy = false;
                } else {
                    vm.finish = true;
                }
            }
        }

        return data;
    }

    function renderCollectionDetail(data) {
        if (data.valid) {
            vm.demos = vm.demos || [];
            vm.demos = vm.demos.concat(data.data.cells);
            vm.invalid = false;
            if (vm.inputPwd) {
                vm.needPwd = true;
            } else {
                vm.needPwd = false;
            }
        }else {

            //认证失败 禁止滚动加载
            vm.needPwd = true;
            vm.demos = null;
            vm.busy = true;
        }
    }

    function renderColumnDetail(data) {
        vm.collectionInfoList = vm.collectionInfoList || [];
        vm.collectionInfoList = vm.collectionInfoList.concat(data.data);
    }

    function invalidate() {
        vm.invalid = true;
    }

    function getCollectionType() {
        return isColumn() ? '集合' : '项目';
    }

    function loadMore() {
        if (vm.busy)return;
        vm.busy = true;
        if (isColumn()) {
            loadColumnDetail(++vm.page);
        } else {
            loadCollectionDetail(vm.ts);
        }
    }

    function error(err) {
        ErrorService.alert(err);
    }
}
