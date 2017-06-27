var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('BangdanComShareController', BangdanComShareController);

function BangdanComShareController(loading, $scope, $modal, $stateParams, FindService,
    $state, UserService, ErrorService, hybrid, $rootScope, $timeout, BangDanService) {

    var vm = this;
    vm.id = $stateParams.id;
    vm.rank = $stateParams.rank;
    vm.bangdanCom = bangdanCom;
    vm.bangdanComDetail = bangdanComDetail;
    vm.inApp = true;
    vm.downloadApp = downloadApp;
    vm.type = $stateParams.type;
    vm.communityType = $stateParams.communityType;
    init();

    function init() {
        if (!hybrid.isInApp) {
            initLinkme();
            vm.inApp = false;
        }

        // sa.track('ViewPage', {
        //         source: 'share_page',
        //         org_id: $stateParams.id + '',
        //         page: 'share_page',
        //     });

        $('.J_commonHeaderWrapper').remove();
        getSingleComInfo(vm.id);
        getQ();
        getCommunityType(vm.communityType);
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

    function initWeixin(name, count, q, rank, logo, type) {
        window.WEIXINSHARE = {
            shareTitle: name + '为' + type + '第' + rank + '名' + ' | 2017Q' + q + ' · 风口社群排行榜',
            shareUrl: window.location.href,
            shareImg: '' + logo + '',
            shareDesc: name + '' + count + '个投资项目都在这里',
        };
        var obj = {};
        window.InitWeixin(obj);
    }

    function getQ() {
        var myDate = new Date();
        var currMonth = myDate.getMonth(); //获取当前月份(0-11,0代表1月)
        var currQuarter = Math.floor((currMonth % 3 == 0 ? (currMonth / 3) : (currMonth / 3 + 1)));
        vm.currQuarter = currQuarter;
        initTitle('2017 · 风口机构排行榜');
    }

    function bangdanCom() {
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
            source:'community_share_page',
            target:'community_top_list',
            community_id: $stateParams.id + '',
            client:client,
            community_type: vm.trackTarget,
        });
        $state.go('bangdan.combd', {});
    }

    function bangdanComDetail(id, rank) {
        var isAndroid = !!navigator.userAgent.match(/android/ig);
        var isIos = !!navigator.userAgent.match(/iphone|ipod|ipad/ig);
        var client = 'H5';
        if (isAndroid) {
            client = 'Android';
        }else if (isIos) {
            client = 'iOS';
        }

        // sa.track('ViewPage', {
        //         source: 'share_page',
        //         org_id: $stateParams.id + '',
        //         page: 'organization',
        //     });

        sa.track('CommunityTopListClick',
          {
            source:'community_share_page',
            target:'community',
            community_id: id + '',
            client:client,
            community_type: vm.trackTarget,
        });

        //放开访问详情
        $state.go('bangdan.combddetail', {
            id: id,
            rank: rank,
            communityType: vm.communityType,
        });
    }

    function getSingleComInfo(id) {
        BangDanService.getSingleComInfo(id)
            .then(function (response) {
                vm.data = response.data;
                initWeixin(vm.data.name, vm.data.projectCount, vm.currQuarter, vm.rank, vm.data.logo, vm.type);
                initWeixinH5();
            });
    }

    function initTitle(t) {
        document.title = t;
    }

    function initLinkme() {
        var krdata = {};
        krdata.type = window.projectEnvConfig.linkmeType;
        krdata.params =
            '{"openlink":"https://' + window.projectEnvConfig.rongHost +
            '/m/#/bangdan/comshare?id=' + $stateParams.id + '&rank=' + $stateParams.rank + '","currentRoom":"0"}';
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

    function initWeixinH5() {
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

                // alert(JSON.stringify(res, null, 4));
                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。

            });

        }, 'jsonp');
    };

    function shareSA() {
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
            source:'community_share_page',
            target:'share',
            community_id: $stateParams.id + '',
            client:client,
            community_type: vm.trackTarget,
        });
    }

}
