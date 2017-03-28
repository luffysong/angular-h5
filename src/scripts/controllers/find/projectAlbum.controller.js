var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('ProjectAlbumController', ProjectAlbumController);

function ProjectAlbumController(demosService, projectColumnService, $state, $stateParams, loading, ErrorService, FindService, $modal) {
    //var vm = this;
    //
    //// URL 参数
    //vm.params = {
    //    type: $stateParams.type,
    //};
    //
    //// 页面 title
    //switch (vm.params.type) {
    //    case 'latest':
    //        document.title = '最新';
    //        vm.title = '最新';
    //        vm.id = 160;
    //        break;
    //    case 'hotest':
    //        document.title = '最热';
    //        vm.title = '最热';
    //        vm.id = 160;
    //        break;
    //    case 'funding':
    //        document.title = '机构在融';
    //        vm.title = '机构在融';
    //        vm.id = 160;
    //        break;
    //}
    //
    //// 页面初始化
    //loading.show('projectAlbumLoading');
    //
    //var COLUMN = 'column';
    //var dataPromise;
    //vm.busy = true;
    //vm.demos = [];
    //vm.type = $stateParams.type;
    //vm.needPwd = false;
    //vm.isColumn = isColumn;
    //vm.goProjects = goProjects;
    //vm.getCollectionType = getCollectionType;
    //vm.loadMore = loadMore;
    //init();
    //
    //function init() {
    //    $('html').css('overflow', '');
    //    $('body').css('overflow', '');
    //
    //    if (isColumn()) {
    //        loadColumnDetail(0);
    //        dataPromise = getColumns();
    //    } else {
    //        loadCollectionDetail(0);
    //        dataPromise = getDemos();
    //    }
    //
    //    dataPromise.then(function (data) {
    //        renderCover(data);
    //    });
    //}
    //
    //function getDemos() {
    //    return demosService.getBaseInfo(vm.id);
    //}
    //
    //function getColumns() {
    //    return projectColumnService.getColumn(vm.id);
    //}
    //
    //function renderCover(cover) {
    //    if (!isColumn()) {
    //        cover = convertCover(cover);
    //    } else {
    //        cover.imgUrl = cover.headPic;
    //    }
    //
    //    vm.cover = cover;
    //    if (vm.cover.intro) {
    //        vm.cover.intro = '介绍：' + vm.cover.intro;
    //    }
    //}
    //
    //function convertCover(cover) {
    //    var coverCopy = {};
    //    coverCopy.proSetCount = cover.proSetCount;
    //    coverCopy.name = cover.proSetName;
    //    coverCopy.intro = cover.fetchCode;
    //    coverCopy.headPic = cover.headPic;
    //    coverCopy.imgUrl = cover.imgUrl;
    //    return coverCopy;
    //}
    //
    //function isColumn() {
    //    return vm.type === COLUMN;
    //}
    //
    //function loadCollectionDetail(ts) {
    //    demosService.getDemos(vm.id, '', ts)
    //        .then(renderList)
    //        .catch(error);
    //}
    //
    //function loadColumnDetail(ts) {
    //    projectColumnService.getDetail(vm.id, ts)
    //        .then(renderList);
    //}
    //
    //function goProjects(id) {
    //    $state.go('demos', {
    //        id: id,
    //        type: 'projects'
    //    }, {
    //        reload: true
    //    });
    //}
    //
    //function renderList(data) {
    //    loading.hide('projectAlbumLoading');
    //    if (isColumn()) {
    //        renderColumnDetail(data);
    //        if (data.totalPages) {
    //            vm.page = data.page || 0;
    //            if (data.totalPages !== vm.page) {
    //                vm.busy = false;
    //            } else {
    //                vm.finish = true;
    //            }
    //        }
    //    } else {
    //        renderCollectionDetail(data);
    //        if (data.valid) {
    //            vm.ts = data.ts || 0;
    //            if (data.data.cells.length) {
    //                vm.busy = false;
    //            } else {
    //                vm.finish = true;
    //            }
    //        }
    //    }
    //
    //    return data;
    //}
    //
    //function renderCollectionDetail(data) {
    //    if (data.valid) {
    //        vm.demos = vm.demos || [];
    //        vm.demos = vm.demos.concat(data.data.cells);
    //        if (vm.inputPwd) {
    //            vm.needPwd = true;
    //        } else {
    //            vm.needPwd = false;
    //        }
    //    } else {
    //        //认证失败 禁止滚动加载
    //        vm.needPwd = true;
    //        vm.demos = null;
    //        vm.busy = true;
    //    }
    //}
    //
    //function renderColumnDetail(data) {
    //    vm.collectionInfoList = vm.collectionInfoList || [];
    //    vm.collectionInfoList = vm.collectionInfoList.concat(data.data);
    //}
    //
    //function getCollectionType() {
    //    return isColumn() ? '集合' : '项目';
    //}
    //
    //function loadMore() {
    //    if (vm.busy) return;
    //    vm.busy = true;
    //    if (isColumn()) {
    //        loadColumnDetail(++vm.page);
    //    } else {
    //        loadCollectionDetail(vm.ts);
    //    }
    //}
    //
    //function error(err) {
    //    loading.hide('projectAlbumLoading');
    //    ErrorService.alert(err);
    //}


    //修改
    var vm = this;

    // URL 参数
    vm.params = {
        type: $stateParams.type,
    };
    vm.type = $stateParams.type;
    // 页面 title
    switch (vm.params.type) {
        case 'latest':
            document.title = '最新';
            vm.title = '最新';
            vm.id = 160;
            break;
        case 'hotest':
            document.title = '最热';
            vm.title = '最热';
            vm.id = 160;
            break;
        case 'funding':
            document.title = '机构在融';
            vm.title = '机构在融';
            vm.id = 160;
            break;
    }


    vm.responseData = [];
    vm.busy = false;
    vm.page = 0;
    //var meetingStatus = [{
    //    label: '最新',
    //    value: 'NEW'
    //}, {
    //    label: '最热',
    //    value: 'HOT'
    //}, {
    //    label: '机构在融',
    //    value: 'FINANCING'
    //}];
    //vm.status = meetingStatus;
    //vm.currentStatus = vm.status[0].value;

    //更多
    vm.more = more;
    vm.loadData = loadData;

    init();

    function init() {
        $('html').css('overflow', '');
        $('body').css('overflow', '');
        document.title = vm.title;
        $('head').append('<meta name="format-detection" content="telephone=no" />');
        vm.type = $stateParams.type;
        loadData();
        initWeixin();
    }

    function loadData() {
        if (vm.type === 'latest') {
            loadLateData();
        }else if (vm.type === 'funding') {
            loadFinancingData();
        }else if (vm.type === 'hotest') {
            loadHotData();
        }
    }

    function initWeixin() {
        window.WEIXINSHARE = {
            shareTitle: vm.title,
            shareUrl: window.location.href,
            shareImg: 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png',
            shareDesc: '来「36氪创投助手」，发现最新最热优质项目！',
            shareButton: 'hide'
        };
        var obj = {};
        window.InitWeixin(obj);
    }
    function more(item, e) {
        e.preventDefault();
        e.stopPropagation();
        $modal.open({
            templateUrl: 'templates/find/nativeAlert.html',
            windowClass: 'nativeAlert_wrap',
            controller: modalController,
            controllerAs: 'vm',
            resolve: {
                obj: function () {
                    return item;
                }
            }
        });
    }

    modalController.$inject = ['$modalInstance', 'obj', 'hybrid'];
    function modalController($modalInstance, obj, hybrid) {

        var vm = this;
        vm.item = obj;
        vm.ktm_source = 'hot_more';
        vm.cancel = cancel;

        function cancel() {
            $modalInstance.dismiss();
        }
    }

    function loadLateData() {
        if (vm.busy)return;
        vm.busy = true;

        var sendData = {
            page: vm.page + 1,
            pageSize: 10
        };
        FindService.getLatestList(sendData)
            .then(function (response) {
                loading.hide('findLoading');
                vm.hasInit = true;
                if (vm.responseData && vm.type === 'latest') {
                    vm.responseData = vm.responseData.concat(response.data.data);
                } else {
                    vm.responseData = response.data.data;
                }

                if (response.data.totalPages) {
                    vm.page = response.data.page || 0;
                    if (response.data.totalPages !== vm.page) {
                        vm.busy = false;
                    } else {
                        vm.finish = true;
                    }
                }
            });
    }

    function loadHotData() {
        if (vm.busy)return;
        vm.busy = true;

        var sendData = {
            page: vm.page + 1,
            pageSize: 10
        };

        FindService.getHottestList(sendData)
            .then(function (response) {
                loading.hide('findLoading');
                vm.hasInit = true;
                if (vm.responseData && vm.type === 'hotest') {
                    vm.responseData = vm.responseData.concat(response.data.data);
                } else {
                    vm.responseData = response.data.data;
                }

                if (response.data.totalPages) {
                    vm.page = response.data.page || 0;
                    if (response.data.totalPages !== vm.page) {
                        vm.busy = false;
                    } else {
                        vm.finish = true;
                    }
                }
            });
    }

    function loadFinancingData() {
        if (vm.busy)return;
        vm.busy = true;

        var sendData = {
            page: vm.page + 1,
            pageSize: 10
        };

        FindService.getFundingList(sendData)
            .then(function (response) {
                loading.hide('findLoading');
                vm.hasInit = true;
                if (vm.responseData && vm.type === 'funding') {
                    vm.responseData = vm.responseData.concat(response.data.data);
                } else {
                    vm.responseData = response.data.data;
                }

                if (response.data.totalPages) {
                    vm.page = response.data.page || 0;
                    if (response.data.totalPages !== vm.page) {
                        vm.busy = false;
                    } else {
                        vm.finish = true;
                    }
                } else {
                    vm.finish = true;
                }
            });
    }

}

