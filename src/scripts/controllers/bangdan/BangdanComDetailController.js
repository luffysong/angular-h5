var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('BangdanComDetailController', BangdanComDetailController);

function BangdanComDetailController(loading, $scope, $modal, $stateParams, FindService,
    $state, UserService, BangDanService, ErrorService, hybrid, $rootScope, $timeout, comInfo, $document) {
    var vm = this;
    vm.page = 0;
    vm.busy = false;
    vm.prolist = [];
    vm.joinpro = joinpro;
    vm.openMore = openMore;
    vm.displayMore = displayMore;
    vm.collapse = true;
    vm.startloading = true;
    vm.loadOrg = true;
    vm.inApp = true;
    vm.downloadApp = downloadApp;
    vm.investRole = false;
    vm.rank = $stateParams.rank;
    vm.goProDetail = goProDetail;
    vm.h5Href = false;
    vm.isEqualHeight = false;
    vm.bdUrl = 'http://bangdanshouji.mikecrm.com/vKzwzTf';
    vm.communityType = $stateParams.communityType;
    vm.moveAction = moveAction;
    //$scope.changeobj = {};
    vm.hasInit = false;
    $scope.currentIndustry = 0;
    vm.changeTabDataState = false;
    vm.rankName ='总榜';
    vm.industryName ='全行业';
    init();

    function init() {
        vm.comInfo = comInfo.data;
        vm.comInfo.communityName = matchType(vm.comInfo.communityTypeEnum);
        if (!hybrid.isInApp) {
            initLinkme();
            vm.inApp = false;
        }
        getComIndustry();
        //getProList();
        changeTab();
        getQ();
        initPxLoader();
        initUser();
        compareRank();
        removeHeader();
        getCommunityType(vm.communityType);
        var HOST = location.host;
        var shareUrl =
        'https://' + HOST + '/m/#/bangdan/comshare?id=' + $stateParams.id + '&rank=' + vm.comInfo.rank + '&communityType=' + $stateParams.communityType + '&industry=' + vm.industry + '&industryName=' + vm.industryName;
        initWeixin(vm.comInfo.name, vm.comInfo.projectCount, vm.currQuarter, vm.comInfo.rank, shareUrl, vm.comInfo.logo, vm.comInfo.communityName);
    }

    function getCommunityType(type){
        if(type == 1){
            vm.trackType = 'famous_enterprise';
        }else if(type == 2){
            vm.trackType = 'top_school';
        }else if(type == 3){
            vm.trackType = 'finance_advisor';
        }else if(type == 4){
            vm.trackType = 'incubator';
        }
    }

    function removeHeader() {
        $('#bannerOther').remove();
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

    function getProList() {
        if (vm.busy) return;
        vm.busy = true;

        var params = {
            page: vm.page + 1,
            pageSize: 10,
            industry: vm.industry == '' ? '': parseInt(vm.industry),
        };
        if (!vm.inApp) {params.pageSize = 2;};

        BangDanService.getComProRank($stateParams.id, params)
        .then(function (response) {
            vm.startloading = false;
            vm.hasInit = true;
            loading.hide('bangdanDetailLoading');
            vm.prolist = vm.prolist.concat(response.data.data);
            if (response.data.totalPages) {
                vm.page = response.data.page || 0;

                if (response.data.totalPages !== vm.page && response.data.data.length > 0) {
                    vm.busy = false;
                } else {
                    vm.finish = true;
                    vm.more = true;
                }
            }
        })
        .catch(fail);
    }

    function displayMore() {
        if (!vm.inApp) return;
        if (vm.busy) return;
        vm.busy = true;

        var params = {
            page: vm.page + 1,
            pageSize: 10,
            industry: vm.industry,
        };

        BangDanService.getComProRank($stateParams.id, params)
        .then(function (response) {
            vm.prolist = vm.prolist.concat(response.data.data);
            if (response.data.totalPages) {
                vm.page = response.data.page || 0;

                if (response.data.totalPages !== vm.page && response.data.data.length > 0) {
                    vm.busy = false;
                } else {
                    vm.finish = true;
                    vm.more = true;
                }
            }
        })
        .catch(fail);
    }

    function compareRank() {
        if (parseInt(vm.rank) !== parseInt(vm.comInfo.rank)) {
            vm.numchange = Math.abs(parseInt(vm.rank) - parseInt(vm.comInfo.rank));
            if (parseInt(vm.rank) > parseInt(vm.comInfo.rank)) {
                vm.rise = true;
            }else {
                vm.rise = false;
            }
        }

    }

    function getQ() {
        var myDate = new Date();
        var currMonth = myDate.getMonth(); //获取当前月份(0-11,0代表1月)
        var currQuarter = Math.floor((currMonth % 3 == 0 ? (currMonth / 3) : (currMonth / 3 + 1)));
        vm.currQuarter = currQuarter;
        //initTitle('2017Q' + vm.currQuarter + ' · 风口社群排行榜');
        initTitle('2017 · 风口社群排行榜');
    }

    function initTitle(t) {
        document.title = t;
    }

    function initWeixin(name, count, q, rank, url, logo, communityName) {
        window.WEIXINSHARE = {
            shareTitle: name + '为' + communityName + '第' + rank + '名 | 2017 · 风口社群排行榜',
            shareUrl: url,
            shareImg: '' + logo + '',
            shareDesc: name + count + '个项目都在这里',
        };

        var obj = {};
        window.InitWeixin(obj);
        initH5();
    }

    function initUser() {
        FindService.getUserProfile()
            .then(function temp(response) {
                if (response.data) {
                    if (response.data.investor) {
                        vm.investRole = true;
                    }
                }
            });
    }

    function openMore(e) {
        var obj = angular.element(e.currentTarget);
        var openClose = obj.find('.open-close');
        var openCloseTxt = obj.find('.open-close-txt');

        var $infoObj = obj.parent().find('.info-content').find('.info').find('.text-content');
        var lineClamp  = '-webkit-line-clamp';
        var fhclmp = $infoObj.attr('cla-height');
        var fh = $infoObj.attr('o-height');

        if (vm.collapse) {
            $infoObj.css(lineClamp, '');
            $infoObj.css('transition', 'height 0.3s');
            $infoObj.css('height', fh + 'px');

            openClose.css('transform', 'rotate(180deg)');
            openCloseTxt.html('收起');
            vm.collapse = false;
        }else {
            $infoObj.css('transition', 'height 0.3s');
            $infoObj.css('height',  fhclmp + 'px');
            $infoObj.css(lineClamp, '4');
            openClose.css('transform', '');
            openCloseTxt.html('展开');
            vm.collapse = true;
        }
    }

    function fail(err) {
        loading.hide('bangdanDetailLoading');
        if (err.code === '403') {
            console.log(err.msg);
        } else if (err.code === '1') {
            ErrorService.alert(err.msg);
        }
    }

    function joinpro(f) {
        var item = vm.comInfo;
        item.currQuarter = vm.currQuarter;
        item.inApp = vm.inApp;
        item.industry = vm.industry;
        item.industryName = vm.industryName;
        var tg = 'join_community_company';
        if (f) {
            item.f = f;tg = 'support';
        }else {
            vm.h5Href = true;
        }
        item.community_type = vm.trackType;
        var isAndroid = !!navigator.userAgent.match(/android/ig);
        var isIos = !!navigator.userAgent.match(/iphone|ipod|ipad/ig);
        var client = 'H5';
        if (isAndroid) {
            client = 'Android';
        }else if (isIos) {
            client = 'iOS';
        }
        sa.track('CommunityTopListClick',
          {
            source:'community',
            target: tg,
            community_id: comInfo.data.communityId + '',
            client:client,
            community_type: vm.trackType,
        });
        if (f) {
            $modal.open({
                    templateUrl: 'templates/bangdan/comsharewin.html',
                    windowClass: 'bd-nativeAlert_wrap',
                    controller: defaultControllerNoForm,
                    controllerAs: 'vm',
                    resolve: {
                        obj: function () {
                            return item;
                        }
                    }
                });
        }else {
            $modal.open({
                    templateUrl: 'templates/bangdan/comsharewin.html',
                    windowClass: 'bd-nativeAlert_wrap',
                    controller: defaultController,
                    controllerAs: 'vm',
                    resolve: {
                        obj: function () {
                            return item;
                        }
                    }
                });
        }
    }

    defaultController.$inject = ['$modalInstance', 'obj'];
    defaultControllerNoForm.$inject = ['$modalInstance', 'obj'];

    function defaultController($modalInstance, obj) {

        var vm = this;
        vm.cancelModal = cancelModal;
        vm.inApp = obj.inApp;
        vm.shareWechat = shareWechat;
        vm.comInfo = obj;
        vm.community_type = obj.community_type;
        init();

        function init() {
        }

        function cancelModal() {
            $modalInstance.dismiss();
        }

        function shareWechat(p) {
            var isAndroid = !!navigator.userAgent.match(/android/ig);
            var isIos = !!navigator.userAgent.match(/iphone|ipod|ipad/ig);
            var client = 'H5';
            if (isAndroid) {
                client = 'Android';
            }else if (isIos) {
                client = 'iOS';
            }

            forwardCount();
            if (hybrid.isInApp) {
                if (p === 'f') {
                    sa.track('CommunityTopListClick',
                      {
                        source:'community_share',
                        target:'moments',
                        community_id: vm.comInfo.communityId + '',
                        client:client,
                        community_type: vm.community_type,
                    });
                    hybrid.open('weChatShareMoments');
                }else {
                    sa.track('CommunityTopListClick',
                      {
                        source:'community_share',
                        target:'wechat',
                        community_id: vm.comInfo.communityId + '',
                        client:client,
                        community_type: vm.community_type,
                    });
                    hybrid.open('weChatShareFriend');
                }

                $timeout(function () {
                    window.location.href = 'http://bangdanshouji.mikecrm.com/vKzwzTf';
                }, 1000);
            }
        }

        function forwardCount() {
            BangDanService.comforwardCount(vm.comInfo.communityId)
            .then(function setdata(response) {
            })
            .catch(fail);
        }
    }

    function defaultControllerNoForm($modalInstance, obj) {

        var vm = this;
        vm.cancelModal = cancelModal;
        vm.inApp = obj.inApp;
        vm.shareWechat = shareWechatNoForm;
        vm.comInfo = obj;
        vm.community_type = obj.community_type;

        init();

        function init() {
            sa.track('ViewPage', {
                    source: 'community',
                    community_id: vm.comInfo.communityId + '',
                    page: 'community_share',
                    community_type: vm.community_type,
                });
        }

        function cancelModal() {
            $modalInstance.dismiss();
        }

        function shareWechatNoForm(p) {
            var isAndroid = !!navigator.userAgent.match(/android/ig);
            var isIos = !!navigator.userAgent.match(/iphone|ipod|ipad/ig);
            var client = 'H5';
            if (isAndroid) {
                client = 'Android';
            }else if (isIos) {
                client = 'iOS';
            }

            forwardCount();
            if (hybrid.isInApp) {
                if (p === 'f') {
                    sa.track('CommunityTopListClick',
                      {
                        source:'community_share',
                        target:'moments',
                        community_id: vm.comInfo.communityId + '',
                        client:client,
                        community_type: vm.community_type,
                    });
                    hybrid.open('weChatShareMoments');
                }else {
                    sa.track('CommunityTopListClick',
                      {
                        source:'community_share',
                        target:'wechat',
                        community_id: vm.comInfo.communityId + '',
                        client:client,
                        community_type: vm.community_type,
                    });
                    hybrid.open('weChatShareFriend');
                }

                $modalInstance.dismiss();
            }
        }

        function forwardCount() {
            BangDanService.comforwardCount(vm.comInfo.communityId)
            .then(function setdata(response) {
            })
            .catch(fail);
        }
    }

    function goProDetail(ccid, e) {

        var isAndroid = !!navigator.userAgent.match(/android/ig);
        var isIos = !!navigator.userAgent.match(/iphone|ipod|ipad/ig);
        var client = 'H5';
        if (isAndroid) {
            client = 'Android';
        }else if (isIos) {
            client = 'iOS';
        }

        sa.track('CommunityTopListClick',
          {
            source:'community',
            target:'company',
            community_id: $stateParams.id + '',
            company_id: ccid,
            client: client,
            community_type: vm.trackType,
        });

        if (ccid) {
            if (hybrid.isInApp) {
                hybrid.open('crmCompany/' + ccid);
            }else {
                var HOST = location.host;
                window.location.href = 'https://' + HOST + '/m/company.html?ccid=' + ccid + '';
            }
        }
    }

    function initLinkme() {
        var krdata = {};
        krdata.type = window.projectEnvConfig.linkmeType;
        krdata.params =
            '{"openlink":"https://' + window.projectEnvConfig.rongHost +
            '/m/#/bangdan/combddetail?id=' + $stateParams.id + '&rank=' + vm.comInfo.rank + '","currentRoom":"0"}';
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

    function matchType(type) {
        switch (type) {
        case 'FAMOUS_ENTERPRISE':
            return '名企';
            break;
        case 'FAMOUS_SCHOOL':
            return '名校';
            break;
        case 'INCUBATOR':
            return '孵化器';
            break;
        case 'FA':
            return 'FA';
            break;
        default:
            return '';
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
                        //shareSA();
                        if (!hybrid.isInApp && vm.h5Href) {
                            window.location.href = 'http://bangdanshouji.mikecrm.com/vKzwzTf' + '';
                        }
                    },

                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        //shareSA();
                        if (!hybrid.isInApp && vm.h5Href) {
                            window.location.href = 'http://bangdanshouji.mikecrm.com/vKzwzTf' + '';
                        }
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
                        if (!hybrid.isInApp && vm.h5Href) {
                            window.location.href = 'http://bangdanshouji.mikecrm.com/vKzwzTf' + '';
                        }
                    },

                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        if (!hybrid.isInApp && vm.h5Href) {
                            window.location.href = 'http://bangdanshouji.mikecrm.com/vKzwzTf' + '';
                        }
                    }
                });
            });

            wx.error(function (res) {
                //alert(JSON.stringify(res, null, 4));

                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。

            });

        }, 'jsonp');
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
        comInfo.data.industryList.forEach(function (item, index) {
            var obj ={};
            obj['label'] = item.name;
            obj['value'] = index + 1;
            industryArr.push(angular.extend({},obj,item));
        });
        $scope.industryArr = industryArr;

        setTab();
        getProList();
    }

    function setTab() {
        $scope.industryArr.forEach(function (item, index) {
            if (item.id == parseInt($stateParams.industry)) {
                $scope.currentIndustry = index;
                vm.rankName = item.name;
                vm.industryName = item.name;
                if (item.value != 0){
                    $timeout(function() {
                        window.WEIXINSHARE.shareTitle = vm.comInfo.name + '为' +vm.comInfo.communityName + vm.industryName +'排名第' + vm.comInfo.rank+ '名 | 2017 · 风口社群排行榜';
                        window.WEIXINSHARE.shareDesc =  vm.comInfo.name + vm.comInfo.projectCount +'个'+vm.industryName+'项目都在这里';
                        var obj = {};
                        window.InitWeixin(obj);
                    },200);
                }
            }
        });
        if ($stateParams.industry) {
            vm.industry = parseInt($stateParams.industry) == 0 ? '' : parseInt($stateParams.industry);
        } else {
            vm.industry = '';
        }

    }

    vm.cTab = parseInt($scope.currentIndustry);
    function moveAction(e ,c) {
        var l = $scope.industryArr.length;
        var changeobj = {};
        if (c) {
            vm.cTab <l ? vm.cTab++ : 0;
            $scope.industryArr.forEach(function (ind, index) {
                if(index == vm.cTab) {
                    vm.industry = ind.id;
                    changeobj = ind;
                }
            });

        } else {
            vm.cTab > 0 ? vm.cTab-- : l-1;
            $scope.industryArr.forEach(function (ind, index) {
                if(index == vm.cTab) {
                    vm.industry = ind.id;
                    changeobj = ind;
                }
            });
        }
        // if (changeobj.value == 0) {
        //     vm.rankName = '总榜';
        // } else {
        //     vm.rankName = changeobj.name;
        // }

        $scope.$broadcast('bdSwipeMoveAction', changeobj);
    }

    function resetData() {
        vm.prolist = [];
        vm.more = false;
        vm.busy = false;
        vm.finish = false;
        vm.page = 0;
        vm.startloading = true;
        vm.hasInit = false;
    }

    function changeTab() {
        $scope.$on('DynamicTabClicked', function (e, item) {
            if (sa && item) {
                sa.track('CommunityTopListClick',
                  {
                    source: 'community',
                    company_industry: item.name,
                    client: getClient(),
                    target: 'industry_tab',
                    community_type: vm.trackType,
                    community_id:$stateParams.id,
                });
            }

            if (item.value == 0 || item.value) {
                vm.industry = item.value == 0 ? '' : item.id;
                //vm.rankName = item.name;
                if (item.value == 0) {
                    vm.rankName = '总榜';
                } else {
                    vm.rankName = item.name;
                }
                getSingleComInfo();
                vm.industryName = item.name;
                if (item.value != 0) {
                    reInitWechat();
                    window.WEIXINSHARE.shareTitle = vm.comInfo.name + '为' +vm.comInfo.communityName + vm.industryName +'排名第' + vm.comInfo.rank+ '名 | 2017 · 风口社群排行榜';
                    window.WEIXINSHARE.shareDesc =  vm.comInfo.name + vm.comInfo.projectCount +'个'+vm.industryName+'项目都在这里';
                    var obj = {};
                    window.InitWeixin(obj);
                } else {
                    reInitWechat();
                    window.WEIXINSHARE.shareTitle = vm.comInfo.name + '为' +vm.comInfo.communityName +'排名第' + vm.comInfo.rank+ '名 | 2017 · 风口社群排行榜';
                    window.WEIXINSHARE.shareDesc = vm.comInfo.name + vm.comInfo.projectCount +'个投资项目都在这里';
                    var obj = {};
                    window.InitWeixin(obj);
                }
                resetData();
                getProList();
            }
        });
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

    function getSingleComInfo(){
        var senddata ={
            industryId: vm.industry,
        }
        BangDanService.getSingleComInfo($stateParams.id, senddata)
        .then(function(response) {
            if (response.data) {
                vm.comInfo.projectCount = response.data.projectCount;
                vm.comInfo.interviewCount = response.data.interviewCount;
                vm.comInfo.accessCount = response.data.accessCount;
                vm.comInfo.rank = response.data.rank;
                vm.comInfo.totalCommunityCount = response.data.totalCommunityCount;
                vm.comInfo.currentTypeCommunityCount = response.data.currentTypeCommunityCount;
            }

        })
        .catch(fail);
    }

    function reInitWechat() {
        var HOST = location.host;
        var shareUrl =
        'https://' + HOST + '/m/#/bangdan/comshare?id=' + $stateParams.id + '&rank=' + vm.comInfo.rank + '&communityType=' + $stateParams.communityType + '&industry=' + vm.industry + '&industryName=' + vm.industryName;
        initWeixin(vm.comInfo.name, vm.comInfo.projectCount, vm.currQuarter, vm.comInfo.rank, shareUrl, vm.comInfo.logo, vm.comInfo.communityName);
    }

}
