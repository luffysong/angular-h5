var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('BangdanInvestorDetailController', BangdanInvestorDetailController);

function BangdanInvestorDetailController(loading, $scope, $modal, $stateParams, FindService,
    $state, UserService, BangDanService, ErrorService, hybrid, $rootScope, $timeout, investorInfo, $document) {
    var vm = this;
    vm.page = 0;
    vm.busy = false;
    vm.prolist = [];
    vm.joinpro = joinpro;
    vm.openMore = openMore;
    vm.focusIndustry = '';
    vm.collapse = true;
    vm.startloading = true;
    vm.loadOrg = true;
    vm.inApp = true;
    vm.downloadApp = downloadApp;
    vm.investRole = false;
    vm.gobdOrg = gobdOrg;
    vm.rank = $stateParams.rank;
    vm.goProDetail = goProDetail;
    vm.moveAction = moveAction;
    vm.hasInit = false;
    vm.h5Href = false;
    vm.isEqualHeight = false;
    vm.bdUrl = 'http://bangdanshouji.mikecrm.com/5z1XNRv';
    $scope.currentIndustry = 0;
    vm.rankName ='总榜';
    vm.industryName ='全行业';
    init();

    function init() {
        vm.investorInfo = investorInfo.data;
        vm.focusIndustry = '';
        if (investorInfo.data.focusIndustry) {
            vm.focusIndustry = investorInfo.data.focusIndustry.join('&nbsp;·&nbsp;');
        }

        if (!hybrid.isInApp) {
            initLinkme();
            vm.inApp = false;
        }
        getComIndustry();
        // getProList();
        changeTab();
        getQ();
        getOrgInfo(investorInfo.data.orgId);
        initPxLoader();
        initUser();
        getTestJson();
        compareRank();
        var HOST = location.host;
        var shareUrl =
        'https://' + HOST + '/m/#/bangdan/investorshare?id=' + $stateParams.id + '&rank=' + vm.investorInfo.rank + '&industry=' + vm.industry;
        initWeixin(vm.investorInfo.name, vm.investorInfo.projectCount, vm.currQuarter, vm.investorInfo.rank, shareUrl, vm.investorInfo.logo);
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
            pageSize: 1000,
            industry: vm.industry,
        };

        if (!vm.inApp) {params.pageSize = 2;};

        BangDanService.getInvestorProRank($stateParams.id, params)
        .then(function setdata(response) {
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

    function getOrgInfo(id) {
        BangDanService.getSingleOrgInfo(id)
        .then(function setdata(response) {
            vm.loadOrg = false;
            vm.orgInfo = response.data;
        })
        .catch(fail);
    }

    function gobdOrg(orgId) {
        $state.go('bangdan.orgbdDetail', {
            id: orgId,
            rank: vm.orgInfo.rank,
        });
    }

    function getTestJson() {
        if (vm.investorInfo.name === '朱啸虎'
            && vm.investorInfo.investorId === 6533) {
            vm.recommend = window.zxhInvestorData.data.data;
        }
    }

    function compareRank() {
        if (parseInt(vm.rank) !== parseInt(vm.investorInfo.rank)) {
            vm.numchange = Math.abs(parseInt(vm.rank) - parseInt(vm.investorInfo.rank));
            if (parseInt(vm.rank) > parseInt(vm.investorInfo.rank)) {
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
        //initTitle('2017Q' + vm.currQuarter + ' · 风云投资人排行榜');
        initTitle('2017 · 风云投资人排行榜');
    }

    function initTitle(t) {
        document.title = t;
    }

    function initWeixin(name, count, q, rank, url, logo) {
        window.WEIXINSHARE = {
            shareTitle: name + '排名第' + rank + '名 | 2017 · 风云投资人排行榜',
            shareUrl: url,
            shareImg: '' + logo + '',
            shareDesc: '立即查看' + name + '所有' + count + '个投资项目',
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
        var $indObj = obj.parent().find('.info-content').find('.industry').find('.in-right').find('.text-content');
        var lineClamp  = '-webkit-line-clamp';
        var fhclmp = $infoObj.attr('cla-height');
        var ihclmp = $indObj.attr('cla-height');
        var fh = $infoObj.attr('o-height');
        var ih = $indObj.attr('o-height');

        if (vm.collapse) {
            $infoObj.css(lineClamp, '');
            $infoObj.css('transition', 'height 0.3s');
            $infoObj.css('height', fh + 'px');

            $indObj.css(lineClamp, '');
            $indObj.css('transition', 'height 0.3s');
            $indObj.css('height', ih + 'px');
            openClose.css('transform', 'rotate(180deg)');
            openCloseTxt.html('收起');
            vm.collapse = false;
        }else {
            $infoObj.css('transition', 'height 0.3s');
            $infoObj.css('height',  fhclmp + 'px');
            $infoObj.css(lineClamp, '4');
            $indObj.css(lineClamp, '2');

            $indObj.css('transition', 'height 0.3s');
            $indObj.css('height',  ihclmp + 'px');
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
        var item = vm.investorInfo;
        //item.rank = parseInt(vm.rank);
        item.currQuarter = vm.currQuarter;
        item.inApp = vm.inApp;
        item.industryName = vm.industryName;
        item.industry = vm.industry;
        var tg = 'join_investor_company';
        if (f) {
            item.f = f;tg = 'support';
        }else {
            vm.h5Href = true;
        }

        var isAndroid = !!navigator.userAgent.match(/android/ig);
        var isIos = !!navigator.userAgent.match(/iphone|ipod|ipad/ig);
        var client = 'H5';
        if (isAndroid) {
            client = 'Android';
        }else if (isIos) {
            client = 'iOS';
        }

        sa.track('InvestorTopListClick',
          {
            source:'investor',
            target: tg,
            investor_id: investorInfo.data.investorId + '',
            client:client,
        });
        if (f) {
            $modal.open({
                    templateUrl: 'templates/bangdan/investorShareWin.html',
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
                    templateUrl: 'templates/bangdan/investorShareWin.html',
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
        vm.investorInfo = obj;

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
                    sa.track('InvestorTopListClick',
                      {
                        source:'investor_share',
                        target:'moments',
                        investor_id: vm.investorInfo.investorId + '',
                        client:client,
                    });
                    hybrid.open('weChatShareMoments');
                }else {
                    sa.track('InvestorTopListClick',
                      {
                        source:'investor_share',
                        target:'wechat',
                        org_id: vm.investorInfo.investorId + '',
                        client:client,
                    });
                    hybrid.open('weChatShareFriend');
                }

                $timeout(function () {
                    window.location.href = 'http://bangdanshouji.mikecrm.com/5z1XNRv';
                }, 1000);
            }
        }

        function forwardCount() {
            BangDanService.investorforwardCount(vm.investorInfo.investorId)
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
        vm.investorInfo = obj;

        init();

        function init() {
            sa.track('ViewPage', {
                    source: 'investor',
                    org_id: vm.investorInfo.investorId + '',
                    page: 'investor_share',
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
                    sa.track('InvestorTopListClick',
                      {
                        source:'investor_share',
                        target:'moments',
                        investor_id: vm.investorInfo.investorId + '',
                        client:client,
                    });
                    hybrid.open('weChatShareMoments');
                }else {
                    sa.track('InvestorTopListClick',
                      {
                        source:'investor_share',
                        target:'wechat',
                        org_id: vm.investorInfo.investorId + '',
                        client:client,
                    });
                    hybrid.open('weChatShareFriend');
                }

                $modalInstance.dismiss();
            }
        }

        function forwardCount() {
            BangDanService.investorforwardCount(vm.investorInfo.investorId)
            .then(function setdata(response) {
            })
            .catch(fail);
        }
    }

    function goProDetail(ccid, e) {
        // var obj = angular.element(e.currentTarget);
        // $timeout(function () {
        //     obj.css('background-color', 'white');
        // }, 200);

        var isAndroid = !!navigator.userAgent.match(/android/ig);
        var isIos = !!navigator.userAgent.match(/iphone|ipod|ipad/ig);
        var client = 'H5';
        if (isAndroid) {
            client = 'Android';
        }else if (isIos) {
            client = 'iOS';
        }

        sa.track('InvestorTopListClick',
          {
            source:'investor',
            target:'company',
            investor_id: $stateParams.id + '',
            company_id: ccid,
            client: client,
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
            '/m/#/bangdan/investorbddetail?id=' + $stateParams.id + '&rank=' + vm.investorInfo.rank + '","currentRoom":"0"}';
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
                        //shareSA();
                        if (!hybrid.isInApp && vm.h5Href) {
                            window.location.href = 'http://bangdanshouji.mikecrm.com/5z1XNRv';
                        }
                    },

                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        //shareSA();
                        if (!hybrid.isInApp && vm.h5Href) {
                            window.location.href = 'http://bangdanshouji.mikecrm.com/5z1XNRv';
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
                            window.location.href = 'http://bangdanshouji.mikecrm.com/5z1XNRv';
                        }
                    },

                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        if (!hybrid.isInApp && vm.h5Href) {
                            window.location.href = 'http://bangdanshouji.mikecrm.com/5z1XNRv';
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
        console.log(investorInfo.data);
        investorInfo.data.industryList.forEach(function (item, index) {
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
                        window.WEIXINSHARE.shareTitle = vm.investorInfo.name + '在' + vm.industryName +'排名第' + vm.investorInfo.rank+ '名 | 2017 · 风云投资人排行榜';
                        window.WEIXINSHARE.shareDesc = '立即查看' + vm.investorInfo.name +'所有'+ vm.investorInfo.projectCount +'个'+vm.industryName+'项目';
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
        if (changeobj.value == 0) {
            vm.rankName = '总榜';
        } else {
            vm.rankName = changeobj.name;
        }
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
        getProList();
    }

    function changeTab() {
        $scope.$on('DynamicTabClicked', function (e, item) {
            if (sa && item) {
                sa.track('InvestorTopListClick',
                  {
                    source: 'investor',
                    target: 'industry_tab',
                    company_industry: item.name,
                    investor_id: $stateParams.id + '',
                    client: getClient(),
                });
            }
            if (item.value == 0 || item.value) {
                vm.industry = item.value == 0 ? '' : item.id;
                if (item.value == 0) {
                    vm.rankName = '总榜';
                } else {
                    vm.rankName = item.name;
                }
                getSingleInvestorInfo();
                vm.industryName = item.name;
                if (item.value != 0) {
                    reInitWechat();
                    window.WEIXINSHARE.shareTitle = vm.investorInfo.name + '在' + vm.industryName +'排名第' + vm.investorInfo.rank+ '名 | 2017 · 风云投资人排行榜';
                    window.WEIXINSHARE.shareDesc = '立即查看' + vm.investorInfo.name +'所有'+ vm.investorInfo.projectCount +'个'+vm.industryName+'项目';
                    var obj = {};
                    window.InitWeixin(obj);
                } else {
                    reInitWechat();
                    window.WEIXINSHARE.shareTitle = vm.investorInfo.name + '排名第' + vm.investorInfo.rank + '名 | 2017 · 风云投资人排行榜';
                    window.WEIXINSHARE.shareDesc = '立即查看' + vm.investorInfo.name + '所有' + vm.investorInfo.projectCount + '个投资项目';
                    var obj = {};
                    window.InitWeixin(obj);
                }
                resetData();
            }
        });
    }

    function getClient(){
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

    function getSingleInvestorInfo(){
        var senddata ={
            industryId: vm.industry,
        }
        BangDanService.getSingleInvestorInfo($stateParams.id, senddata)
        .then(function(response) {
            if (response.data) {
                vm.investorInfo.projectCount = response.data.projectCount;
                vm.investorInfo.interviewCount = response.data.interviewCount;
                vm.investorInfo.accessCount = response.data.accessCount;
                vm.investorInfo.rank = response.data.rank;
                vm.investorInfo.totalInvestorCount = response.data.totalInvestorCount;
                vm.investorInfo.currentIndustryInvestorCount = response.data.currentIndustryInvestorCount;
            }

        })
        .catch(fail);
    }

    function reInitWechat(){
        var HOST = location.host;
        var shareUrl =
        'https://' + HOST + '/m/#/bangdan/investorshare?id=' + $stateParams.id + '&rank=' + vm.investorInfo.rank + '&industry=' + vm.industry;
        initWeixin(vm.investorInfo.name, vm.investorInfo.projectCount, vm.currQuarter, vm.investorInfo.rank, shareUrl, vm.investorInfo.logo);
    }

}
