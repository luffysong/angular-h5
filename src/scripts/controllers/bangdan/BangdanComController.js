var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('BangdanComController', BangdanComController);

function BangdanComController(loading, $scope, $modal, $stateParams, FindService,
    $state, UserService, ErrorService, hybrid, $rootScope, $timeout, BangDanService, $window, $document, industry) {

    var vm = this;
    vm.list = [];
    vm.page = 0;
    vm.more = false;
    vm.busy = false;
    vm.startloading = true;
    vm.isBottom = false;
    vm.displayMore = displayMore;
    vm.goComDetail = goComDetail;
    vm.joinCom = joinCom;
    vm.inApp = true;
    vm.total;
    vm.downloadApp = downloadApp;
    vm.bdUrl = 'http://bangdanshouji.mikecrm.com/MqEpIPR';
    vm.changeTab = changeTab;
    vm.addWechat = addWechat;
    vm.isRise = false;
    vm.industryName ='全行业';

    var comType = [{
        label: '名企',
        value: '1'
    }, {
        label: '名校',
        value: '2'
    }, {
        label: 'FA',
        value: '3'
    },
    {
        label: '孵化器',
        value: '4'
    }];
    $scope.comType = comType;
    var ct = window.sessionStorage.getItem('comType');
    if (ct && ct != 'undefined') {
        //vm.communityType = $stateParams.communityType || ct;
        $scope.currentComType = $stateParams.communityType || ct;
        vm.communityType = $stateParams.communityType || parseInt(ct);
    } else {
        $scope.currentComType = $stateParams.communityType || '1';
        vm.communityType = $stateParams.communityType || 1;
    }

    vm.moveAction = moveAction;
    vm.hasInit = false;
    //$scope.changeobj = {};
    //$scope.changeptab = {};
    $scope.industryArr =[];
    init();

    function init() {
        getComIndustry();
        if (!hybrid.isInApp) {
            initLinkme();
            vm.inApp = false;
        }
        getQ();
        getComRank();
        initPxLoader();
        addAnimate();
        vm.type = getTypeText(vm.communityType);
        removeHeader();
        getTrackParams(vm.communityType);
        changeTab();
        changeDynamicTab();
        sa.track('ViewPage',
          {
            source: vm.trackSource,
            page: 'community_top_list',
            community_type: vm.trackTarget,
        });
    }

    function getTrackParams(type){
        if(type == 1){
            vm.trackSource = 'community_famous_enterprise';
            vm.trackTarget = 'famous_enterprise';
        }else if(type == 2){
            vm.trackSource = 'community_top_school';
            vm.trackTarget = 'top_school';
        }else if(type == 3){
            vm.trackSource = 'community_finance_advisor';
            vm.trackTarget = 'finance_advisor';
        }else if(type == 4){
            vm.trackSource = 'community_incubator';
            vm.trackTarget = 'incubator';
        }
    }

    function removeHeader() {
        $('#bannerOther').remove();
    }

    function changeTab(type) {

        var client = getClient();

        $scope.$on('tabClicked', function (e, item) {
            //父级tab切换都返回第一条；
            // $scope.industryArr.forEach(function (ind, index) {
            //     if (index === 0) {
            //         $scope.changeobj = ind;
            //         console.log($scope.changeobj.name)
            //     }
            // });

            if (item.value === '1') {
                window.sessionStorage.removeItem('com-position');
                window.sessionStorage.removeItem('com-id');
                getTrackParams(item.value);
                saTrack(client, item);
            }else if (item.value === '2') {
                window.sessionStorage.removeItem('com-position');
                window.sessionStorage.removeItem('com-id');
                getTrackParams(item.value);
                saTrack(client, item);
            }else if (item.value === '3') {
                window.sessionStorage.removeItem('com-position');
                window.sessionStorage.removeItem('com-id');
                getTrackParams(item.value);
                saTrack(client, item);
            }else if (item.value === '4') {
                window.sessionStorage.removeItem('com-position');
                window.sessionStorage.removeItem('com-id');
                getTrackParams(item.value);
                saTrack(client, item);
            }
        });
    }

    function resetData() {
        vm.list = [];
        vm.more = false;
        vm.busy = false;
        vm.finish = false;
        vm.page = 0;
        vm.startloading = true;
        vm.hasInit = false;
    }

    function saTrack(client, item) {
        sa.track('CommunityTopListClick',
          {
            source: vm.trackSource,
            target: vm.trackTarget,
            client: client,
            community_type: vm.trackTarget,
        });

        vm.communityType = item.value;
        resetData();
        getComRank();

        //$state.go('.', { communityType: vm.communityType });

    }

    function addAnimate() {
        angular.element(window).bind('scroll', function () {
            var windowHeight = $(this).height();
            var scrollTop = $(this).scrollTop();
            var scrollHeight = $(document).height();
            if ((windowHeight +  scrollTop) === scrollHeight) {
                $timeout(function () {
                    if (!vm.isBottom) {
                        vm.isBottom = true;
                    }
                    var queryResult = $document[0].getElementById('div-open-app');
                    $(queryResult).css('height', '80px');
                },10);
            } else {
                $timeout(function () {
                    if (vm.isBottom) {
                        vm.isBottom = false;
                    }
                },10);
            }
        });
    }

    function getQ() {
        var myDate = new Date();
        var currMonth = myDate.getMonth(); //获取当前月份(0-11,0代表1月)
        var currQuarter = Math.floor((currMonth % 3 == 0 ? (currMonth / 3) : (currMonth / 3 + 1)));
        vm.currQuarter = currQuarter;
        initTitle('2017Q' + vm.currQuarter + ' · 风口社群排行榜');
    }

    function initPxLoader() {
        var loader = new PxLoader();
        var imgArr = document.getElementsByTagName('img');
        for (var i = 0; i < imgArr.length; i++) {
            var pxImage = new PxLoaderImage(imgArr[i].src);
            pxImage.imageNumber = i + 1;
            loader.add(pxImage);
        }

        loader.addProgressListener(function (e) {});

        loader.addCompletionListener(function (e) {
            vm.picState = true;
        });

        loader.start();
    }

    function initWeixin(q, count, type, totalCount) {
        window.WEIXINSHARE = {
            shareTitle: '【2017 · 风口社群排行榜】已有' + totalCount + '家社群加入',
            shareUrl: window.location.href,
            shareImg: 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png',
            shareDesc: count + '家' + type +'社群所有项目都在这里',
        };

        var obj = {};
        window.InitWeixin(obj);
        initH5();
    }

    function initTitle(t) {
        document.title = t;
    }

    function getTypeText(type){
        if(type == 1){
            return '名企';
        }else if(type == 2){
            return '名校';
        }else if(type == 3){
            return 'FA';
        }else if(type == 4){
            return '孵化器';
        }
    }

    function getComRank(fn) {
        if (vm.busy) return;
        vm.busy = true;
        var request = {
            page: vm.page + 1,
            pageSize: 10,
            communityType: vm.communityType,
            industry: vm.industry || ''
        };
        if (!vm.inApp) {request.pageSize = 10; };

        BangDanService.getComRank(request)
            .then(function (response) {
                vm.startloading = false;
                loading.hide('bangdanLoading');
                vm.hasInit = true;
                vm.result = response.data.pageData;
                vm.list = vm.list.concat(response.data.pageData.data);
                vm.totalCount = response.data.communityCount.totalCount;
                if (!vm.total) {
                    vm.total = response.data.communityCount.currentTypeCount;
                    initWeixin(vm.currQuarter, vm.total, vm.type, vm.totalCount);
                }

                if (response.data.pageData.totalPages) {
                    vm.page = response.data.pageData.page || 0;
                    if (response.data.pageData.totalPages !== vm.page && response.data.pageData.data.length > 0) {
                        vm.busy = false;
                    } else {
                        vm.finish = true;
                        vm.more = true;
                    }
                }

                if (fn) {
                    fn();
                } else {
                    positionItem();
                }
            }).catch(fail);
    }

    function getClient() {
        var isAndroid = !!navigator.userAgent.match(/android/ig);
        var isIos = !!navigator.userAgent.match(/iphone|ipod|ipad/ig);
        var client = 'H5';
        if (isAndroid) {
            client = 'Android';
        }else if (isIos) {
            client = 'iOS';
        }
        return client;
    }

    function goComDetail(id, rank) {
        var val = angular.element(window).scrollTop();
        window.sessionStorage.removeItem('com-position');
        window.sessionStorage.removeItem('com-id');
        window.sessionStorage.removeItem('comType');
        window.sessionStorage.removeItem('industryIndex');
        window.sessionStorage.removeItem('industry');
        window.sessionStorage.removeItem('industryName');

        window.sessionStorage.setItem('com-position', val);
        window.sessionStorage.setItem('com-id', id);
        window.sessionStorage.setItem('comType', vm.communityType);
        window.sessionStorage.setItem('industryIndex', vm.industryIndex);
        window.sessionStorage.setItem('industry', vm.industry);
        window.sessionStorage.setItem('industryName', vm.industryName);
        var client = getClient();
        getTrackParams(vm.communityType);
        sa.track('CommunityTopListClick',
          {
            source: vm.trackSource,
            target: 'community',
            community_id: id + '',
            client: client,
            community_type: vm.trackTarget,
        });

        $state.go('bangdan.combddetail', {
            id: id,
            rank: rank,
            communityType: vm.communityType,
            industry: vm.industry,
        });
    }

    function displayMore() {
        if (!vm.inApp) return;
        if (vm.busy) return;
        vm.busy = true;
        var request = {
            page: vm.page + 1,
            pageSize: 10,
            communityType: vm.communityType,
            industry: vm.industry || ''
        };
        BangDanService.getComRank(request)
            .then(function (response) {
                $timeout(function () {
                    vm.list = vm.list.concat(response.data.pageData.data);
                    vm.totalCount = response.data.communityCount.totalCount;
                    if (!vm.total) {
                        vm.total = response.data.communityCount.currentTypeCount;
                        initWeixin(vm.currQuarter, vm.total, vm.type, vm.totalCount);
                    }
                    if (response.data.pageData.totalPages) {
                        vm.page = response.data.pageData.page || 0;
                        if (response.data.pageData.totalPages !== vm.page && response.data.pageData.data.length > 0) {
                            vm.busy = false;
                        } else {
                            vm.finish = true;
                            vm.more = true;
                        }
                    }
                }, 500);
        }).catch(fail);
    }

    function fail(err) {
        loading.hide('bangdanLoading');
        ErrorService.alert(err.err.msg);
    }

    $scope.abs = function (number) {
        return Math.abs(number);
    };

    function joinCom() {
        var client = getClient();
        getTrackParams(vm.communityType);
        sa.track('CommunityTopListClick',
          {
            source: vm.trackSource,
            target: 'join_community_top_list',
            client: client,
            community_type: vm.trackTarget,
        });
        window.location.href = 'http://bangdanshouji.mikecrm.com/JqRkih4';
    }

    function initLinkme() {
        var krdata = {};
        krdata.type = window.projectEnvConfig.linkmeType;
        krdata.params =
            '{"openlink":"https://' + window.projectEnvConfig.rongHost + '/m/#/bangdan/combd' + '","currentRoom":"0"}';
        window.linkedme.init(window.projectEnvConfig.linkmeKey, {
            type: window.projectEnvConfig.linkmeType
        }, function (err, res) {
            if (err) {
                return;
            }
            window.linkedme.link(krdata, function (err, data) {
                if (err) {
                    // 生成深度链接失败，返回错误对象err
                    console.log(err);
                } else {
                    vm.openAppUrl = data.url;
                }
            }, false);
        });
    }

    function downloadApp() {
        if (!vm.inApp) {
            window.location.href = vm.openAppUrl;
        }
    }

    function initH5() {
        var signature = '';
        var nonceStr = 'xcvdsjlk$klsc';
        var timestamp = parseInt(new Date().getTime() / 1000);

        $.get('/api/weixin/token?_=' + $.now(), {
            url: location.href.replace(/#.*$/, ''),
            timestamp: timestamp,
            noncestr: nonceStr
        }, function (data) {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: 'wxd3ea1a9a22815a8c', // 必填，公众号的唯一标识
                timestamp: timestamp, // 必填，生成签名的时间戳
                nonceStr: nonceStr, // 必填，生成签名的随机串
                signature: data.data.token,// 必填，签名，见附录1
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });

            wx.ready(function () {

                wx.onMenuShareTimeline({
                    title: WEIXINSHARE.shareTitle, // 分享标题
                    link: WEIXINSHARE.shareUrl, // 分享链接
                    imgUrl: WEIXINSHARE.shareImg || 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png', // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        shareSA();
                    },

                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        shareSA();
                    }
                });

                wx.onMenuShareAppMessage({
                    title: WEIXINSHARE.shareTitle, // 分享标题
                    desc: WEIXINSHARE.shareDesc, // 分享描述
                    link: WEIXINSHARE.shareUrl, // 分享链接
                    imgUrl: WEIXINSHARE.shareImg || 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png', // 分享图标
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        shareSA();
                    },

                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        shareSA();
                    }
                });
            });

            wx.error(function (res) {
                //alert(JSON.stringify(res, null, 4));

                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。

            });

        }, 'jsonp');
    }

    function shareSA() {
        var isAndroid = !!navigator.userAgent.match(/android/ig);
        var isIos = !!navigator.userAgent.match(/iphone|ipod|ipad/ig);
        var client = 'H5';
        if (isAndroid) {
            client = 'Android';
        }else if (isIos) {
            client = 'iOS';
        }
        getTrackParams(vm.communityType);
        sa.track('InvestorTopListClick',
          {
            source: 'investor_top_list',
            target: 'share',
            client: client,
            community_type: vm.trackTarget,
        });
    }

    function someArray() {
        var r = vm.result.data.some(function (data, index, array) {
            return data.communityId == vm.storageId;
        });
        if (!r) {
            getComRank(someArray);
        } else {
            $document.scrollTopAnimated(parseInt(vm.storagePosition)).then(function () {
                //console && console.log('You just scrolled to the position!');
            });
        }
    }

    function positionItem() {
        var value = window.sessionStorage.getItem('com-position');
        var id = window.sessionStorage.getItem('com-id');
        if (vm.result.data && value && id && vm.inApp) {
            vm.storageId = id;
            vm.storagePosition = value;
            someArray();
        } else {
            $document.scrollTopAnimated(parseInt(value)).then(function () {
                //console && console.log('You just scrolled to the position!');
            });
        }
    }

    function getComIndustry() {
        var f = {
            label: '全行业',
            value: 0,
            id: 0,
            name: '全行业'
        }
        var industryArr = [];
        industryArr.push(f);
        industry.data.forEach(function (item, index) {
                var obj ={};
                obj['label'] = item.name;
                obj['value'] = index + 1;
                industryArr.push(angular.extend({},obj,item));
        });
        $scope.industryArr = industryArr;

        var iix = window.sessionStorage.getItem('industryIndex');
        var ind = window.sessionStorage.getItem('industry');
        var indName = window.sessionStorage.getItem('industryName');
        if (ind && ind != 'undefined') {
            vm.industry = ind;
        }
        if (indName && indName != 'undefined' && indName != '全行业') {
            vm.industryName = indName;
            window.WEIXINSHARE.shareDesc = vm.total + '家' +vm.type + '所有' +vm.industryName+'项目都在这里';
            var obj = {};
            window.InitWeixin(obj);
        }
        if (iix && iix != 'undefined') {
            $scope.currentIndustry = $stateParams.industry || parseInt(iix);
        } else {
            $scope.currentIndustry = $stateParams.industry || 0;
            vm.isRise = true;
        }
        //$scope.currentIndustry = $stateParams.industry || 0;
    }

    vm.cTab = parseInt($scope.currentIndustry);
    function moveAction(e ,c) {
        var l = $scope.industryArr.length;
        var changeobj= {};
        if (c) {
            vm.cTab <l ? vm.cTab++ : 0;
            $scope.industryArr.forEach(function (ind, index) {
                if(index == vm.cTab) {
                    vm.industry = vm.cTab;
                    //$scope.changeobj = ind;
                    changeobj = ind;
                }
            });

        } else {
            vm.cTab > 0 ? vm.cTab-- : l-1;
            $scope.industryArr.forEach(function (ind, index) {
                if(index == vm.cTab) {
                    vm.industry = vm.cTab;
                    //$scope.changeobj = ind;
                    changeobj = ind;
                }
            });
        }

        $scope.$broadcast('bdSwipeMoveAction', changeobj);
    }

    function changeDynamicTab() {
        $scope.$on('DynamicTabClicked', function (e, item) {
            if (sa && item) {
                sa.track('CommunityTopListClick',
                  {
                    source: vm.trackSource,
                    company_industry: item.name,
                    client: getClient(),
                    target: 'industry_tab',
                    community_type: vm.trackTarget,
                });
            }
            window.sessionStorage.removeItem('com-position');
            window.sessionStorage.removeItem('com-id');
            window.sessionStorage.setItem('comType', vm.communityType);
            window.sessionStorage.setItem('industryIndex', vm.industryIndex);
            window.sessionStorage.setItem('industry', vm.industry);
            if (item.value == 0 || item.value) {
                vm.industry = item.value == 0 ? '' : item.id;
                vm.industryIndex = item.value;
                vm.industryName = item.name;
                if (item.value != 0) {
                    window.WEIXINSHARE.shareDesc = vm.total + '家' +vm.type + '所有' +vm.industryName+'项目都在这里';
                    var obj = {};
                    window.InitWeixin(obj);
                }
                if (item.value == 0){
                    vm.isRise = true;
                } else {
                    vm.isRise = false;
                }
                resetData();
                getComRank();
            }
        });
    }

    function addWechat(){
        $modal.open({
            templateUrl: 'templates/bangdan/addWechat.html',
            windowClass: 'bd-add-wechat-wrap',
            controller: defaultController,
            controllerAs: 'vm',
        });
    }


    function defaultController($modalInstance){
        var vm = this;
        vm.cancelModal = cancelModal;
        function cancelModal() {
            $modalInstance.dismiss();
        }
    }

    function getClient() {
        var isAndroid = !!navigator.userAgent.match(/android/ig);
        var isIos = !!navigator.userAgent.match(/iphone|ipod|ipad/ig);
        var client = 'H5';
        if (isAndroid) {
            client = 'Android';
        }else if (isIos) {
            client = 'iOS';
        }
        return client;
    }

}
