var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('ProjectAlbumController', ProjectAlbumController);

function ProjectAlbumController(demosService, projectColumnService, $state, $stateParams, loading, ErrorService) {
    var vm = this;

    // URL 参数
    vm.params = {
        type: $stateParams.type,
    };

    // 页面 title
    switch (vm.params.type) {
        case 'rong':
            document.title = '机构在融';
            vm.title = '机构在融';
            vm.id = 160;
            break;
        case 'hunting':
            document.title = 'HUNTING+';
            vm.title = 'HUNTING+';
            vm.id = 160;
            break;
        case 'timer':
            document.title = '限时首发';
            vm.title = '限时首发';
            vm.id = 160;
            break;
    }

    // 页面初始化
    loading.show('projectAlbumLoading');

    var COLUMN = 'column';
    var dataPromise;

    init();

    function init() {
        $('html').css('overflow', '');
        $('body').css('overflow', '');

        if (isColumn()) {
            loadColumnDetail(0);
            dataPromise = getColumns();
        } else {
            loadCollectionDetail(0);
            dataPromise = getDemos();
        }

        dataPromise.then(function (data) {
            renderCover(data);
        });
    }

    function getDemos() {
        return demosService.getBaseInfo(vm.id);
    }

    function getColumns() {
        return projectColumnService.getColumn(vm.id);
    }

    function renderCover(cover) {
        if (!isColumn()) {
            cover = convertCover(cover);
        } else {
            cover.imgUrl = cover.headPic;
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
        coverCopy.headPic = cover.headPic;
        coverCopy.imgUrl = cover.imgUrl;
        return coverCopy;
    }

    function isColumn() {
        return vm.type === COLUMN;
    }

    function loadCollectionDetail(ts) {
        demosService.getDemos(vm.id, '', ts)
            .then(renderList)
            .catch(error);
    }

    function loadColumnDetail(ts) {
        projectColumnService.getDetail(vm.id, ts)
            .then(renderList);
    }

    function goProjects(id) {
        $state.go('demos', {
            id: id,
            type: 'projects'
        }, {
            reload: true
        });
    }

    function renderList(data) {
        loading.hide('projectAlbumLoading');
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
        } else {
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
        } else {
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
        if (vm.busy) return;
        vm.busy = true;
        if (isColumn()) {
            loadColumnDetail(++vm.page);
        } else {
            loadCollectionDetail(vm.ts);
        }
    }

    function error(err) {
        loading.hide('projectAlbumLoading');
        ErrorService.alert(err);
    }
}
