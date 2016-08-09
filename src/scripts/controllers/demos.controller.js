
var  angular = require('angular');
angular.module('defaultApp.controller')
.controller('DemosController', DemosController);

function DemosController(demosService, projectColumnService,
    $state, $stateParams, cover, loading) {
    var vm = this;
    var COLUMN = 'column';
    vm.id = $stateParams.id;
    vm.busy = true;
    vm.demos = [];
    vm.type = $stateParams.type;

    vm.isColumn = isColumn;
    vm.goProjects = goProjects;
    vm.getCollectionType = getCollectionType;
    vm.vadliateAndGetDemos = vadliateAndGetDemos;
    vm.loadMore = loadMore;
    init();
    function init() {
        if (isColumn()) {
            loadColumnDetail(1);
        }else {
            loadCollectionDetail(1);
        }

        renderCover(cover);
        initWeixin(cover);
        loading.hide('demos');
    }

    function initWeixin(data) {
        document.title = data.name || data.proSetName;
        window.WEIXINSHARE = {
            shareTitle: data.name || data.proSetName,
            shareImg: data.sharePic || 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png',
            shareDesc: '来「36氪创投助手」，发现最新最热优质项目！'
        };
        window.InitWeixin();
    }

    function vadliateAndGetDemos() {
        demosService.getDemos($stateParams.id, vm.password)
            .then(renderList)
            .catch(invalidate);
    }

    function renderCover(cover) {
        if (!isColumn()) {
            cover = convertCover(cover);
        }

        vm.cover = cover;
    }

    function convertCover(cover) {
        var coverCopy = {};
        coverCopy.proSetCount = cover.proSetCount;
        coverCopy.bgPic = cover.bgPic;
        coverCopy.name = cover.proSetName;
        coverCopy.intro = cover.fetchCode;
        return coverCopy;
    }

    function isColumn() {
        return vm.type === COLUMN;
    }

    function loadCollectionDetail(page) {
        demosService.getDemos($stateParams.id, page)
        .then(renderList)
        .catch(renderList);
    }

    function loadColumnDetail(page) {
        projectColumnService.getDetail($stateParams.id, page)
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
        }else {
            renderCollectionDetail(data);
        }

        if (data.totalPages) {
            vm.page = data.page || 0;
            if (data.totalPages !== vm.page) {
                vm.busy = false;
            } else {
                vm.finish = true;
            }
        }

        return data;
    }

    function renderCollectionDetail(data) {
        var NOT_AUTHORIZE = 1;
        if (data.code !== NOT_AUTHORIZE) {
            vm.demos = vm.demos || [];
            vm.demos = vm.demos.concat(data.data);
            vm.invalid = false;
        }else {

            //认证失败 禁止滚动加载
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
            loadCollectionDetail(++vm.page);
        }
    }
}
