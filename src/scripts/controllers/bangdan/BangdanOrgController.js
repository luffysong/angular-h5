var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('BangdanOrgController', BangdanOrgController);

function BangdanOrgController(loading, $scope, $modal, $stateParams, FindService,
    $state, UserService, ErrorService, hybrid, $rootScope, $timeout, BangDanService, $window, $document, industry) {

    var vm = this;
    vm.list = [];
    vm.page = 0;
    vm.more = false;
    vm.busy = false;
    vm.startloading = true;
    vm.isBottom = false;
    vm.displayMore = displayMore;
    vm.goOrgDetail = goOrgDetail;
    vm.joinOrg = joinOrg;
    vm.inApp = true;
    vm.total;
    vm.downloadApp = downloadApp;
    vm.moveAction = moveAction;
    vm.addWechat = addWechat;
    //$scope.changeobj = {};
    $scope.industryArr =[];
    vm.hasInit = false;
    $scope.isRise = false;

    init();

    function init() {
        getOrgIndustry();
        if (!hybrid.isInApp) {
            initLinkme();
            vm.inApp = false;
        }

        getQ();
        getOrgRank();
        initPxLoader();
        addAnimate();
        changeTab();
    }

    function addAnimate() {
        angular.element(window).bind('scroll', function () {
            var windowHeight = $(this).height();
            var scrollTop = $(this).scrollTop();
            var scrollHeight = $(document).height();
            if ((windowHeight +  scrollTop) === scrollHeight) {
                var queryResult = $document[0].getElementById('div-open-app');
                $(queryResult).css('height', '80px');
                if (!vm.isBottom) {
                    vm.isBottom = true;
                }
            } else {
                if (vm.isBottom) {
                    vm.isBottom = false;
                }
            }
        });
    }

    function getQ() {
        var myDate = new Date();
        var currMonth = myDate.getMonth(); //获取当前月份(0-11,0代表1月)
        var currQuarter = Math.floor((currMonth % 3 == 0 ? (currMonth / 3) : (currMonth / 3 + 1)));
        vm.currQuarter = currQuarter;
        initTitle('2017Q' + vm.currQuarter + '·风口机构排行榜');
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

    function initWeixin(q, count) {
        window.WEIXINSHARE = {
            shareTitle: '【2017Q' + q + '· 风口机构排行榜】已有' + count + '家机构加入',
            shareUrl: window.location.href,
            shareImg: 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png',
            shareDesc: '所有机构的被投项目都在这里',
        };

        var obj = {};
        window.InitWeixin(obj);
        initH5();
    }

    function initTitle(t) {
        document.title = t;
    }

    function getOrgIndustry() {
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
        if (ind && ind != 'undefined') {
            vm.industry = ind;
        }
        if (iix && iix != 'undefined') {
            $scope.currentIndustry = $stateParams.industry || parseInt(iix);
        } else {
            $scope.currentIndustry = $stateParams.industry || 0;
            $scope.isRise = true;
        }

    }

    function getOrgRank(fn) {
        if (vm.busy) return;
        vm.busy = true;
        var request = {
            page: vm.page + 1,
            pageSize: 10,
            industry: vm.industry || ''
        };
        if (!vm.inApp) {request.pageSize = 20; };

        BangDanService.getOrgRank(request)
            .then(function (response) {
                $timeout(function () {
                    vm.startloading = false;
                    vm.hasInit = true;
                    loading.hide('bangdanLoading');
                    vm.result = response.data.data;
                    vm.list = vm.list.concat(response.data.data);
                    if (!vm.total) {
                        vm.total = response.data.totalCount;
                        initWeixin(vm.currQuarter, vm.total);
                    }

                    if (response.data.totalPages) {
                        vm.page = response.data.page || 0;
                        if (response.data.totalPages !== vm.page && response.data.data.length > 0) {
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
                },200);
            }).catch(fail);
    }

    function goOrgDetail(id, rank) {
        var val = angular.element(window).scrollTop();
        window.sessionStorage.removeItem('org-position');
        window.sessionStorage.removeItem('org-id');
        window.sessionStorage.removeItem('industryIndex');
        window.sessionStorage.removeItem('industry');
        window.sessionStorage.setItem('org-position', val);
        window.sessionStorage.setItem('org-id', id);
        window.sessionStorage.setItem('industryIndex', vm.industryIndex);
        window.sessionStorage.setItem('industry', vm.industry);

        var isAndroid = !!navigator.userAgent.match(/android/ig);
        var isIos = !!navigator.userAgent.match(/iphone|ipod|ipad/ig);
        var client = 'H5';
        if (isAndroid) {
            client = 'Android';
        }else if (isIos) {
            client = 'iOS';
        }

        // sa.track('ViewPage', {
        //         source: 'org_top_list',
        //         org_id: $stateParams.id + '',
        //         page: 'organization',
        //     });

        sa.track('OrgTopListClick',
          {
            source: 'org_top_list',
            target: 'organization',
            org_id: id + '',
            client: client,
        });

        //放开访问详情
        $state.go('bangdan.orgbdDetail', {
            id: id,
            rank: rank,
            industry: vm.industry
        });
    }

    function displayMore() {
        if (!vm.inApp) return;
        if (vm.busy) return;
        vm.busy = true;
        var request = {
            page: vm.page + 1,
            pageSize: 10,
            industry: vm.industry || ''
        };
        BangDanService.getOrgRank(request)
            .then(function (response) {
                $timeout(function () {
                    vm.list = vm.list.concat(response.data.data);
                    if (!vm.total) {
                        vm.total = response.data.totalCount;
                        initWeixin(vm.currQuarter, vm.total);
                    }

                    if (response.data.totalPages) {
                        vm.page = response.data.page || 0;
                        if (response.data.totalPages !== vm.page && response.data.data.length > 0) {
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

    function someArray() {
        var r = vm.result.some(function (data, index, array) {
            return data.orgId == vm.storageId;
        });

        if (!r) {
            getOrgRank(someArray);
        } else {
            $document.scrollTopAnimated(parseInt(vm.storagePosition)).then(function () {
                console && console.log('You just scrolled to the position!');
            });
        }
    }

    function positionItem() {
        var value = window.sessionStorage.getItem('org-position');
        var id = window.sessionStorage.getItem('org-id');
        if (vm.result && value && id && vm.inApp) {
            vm.storageId = id;
            vm.storagePosition = value;
            someArray();
        } else {
            $document.scrollTopAnimated(parseInt(value)).then(function () {
                console && console.log('You just scrolled to the position!');
            });
        }
    }

    function joinOrg() {
        var isAndroid = !!navigator.userAgent.match(/android/ig);
        var isIos = !!navigator.userAgent.match(/iphone|ipod|ipad/ig);
        var client = 'H5';
        if (isAndroid) {
            client = 'Android';
        }else if (isIos) {
            client = 'iOS';
        }

        sa.track('OrgTopListClick',
          {
            source:'org_top_list',
            target:'join_org_top_list',
            client:client,
        });
        window.location.href = 'http://cn.mikecrm.com/70INKZM';
    }

    function initLinkme() {
        var krdata = {};
        krdata.type = window.projectEnvConfig.linkmeType;
        krdata.params =
            '{"openlink":"https://' + window.projectEnvConfig.rongHost + '/m/#/bangdan/orgbd' + '","currentRoom":"0"}';
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

        sa.track('OrgTopListClick',
          {
            source: 'organization',
            target: 'share',
            client: client,
        });
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

        $scope.$broadcast('bdSwipeMoveAction', changeobj);
    }

    function resetData() {
        vm.list = [];
        vm.more = false;
        vm.busy = false;
        vm.finish = false;
        vm.page = 0;
        vm.startloading = true;
        vm.hasInit = false;
        //为了确保数据被清空；
        getOrgRank();
    }

    function changeTab() {
        $scope.$on('DynamicTabClicked', function (e, item) {
            window.sessionStorage.removeItem('org-position');
            window.sessionStorage.removeItem('org-id');
            window.sessionStorage.removeItem('industryIndex');
            window.sessionStorage.removeItem('industry', vm.industry);
            if (sa) {
                sa.track('OrgTopListClick',
                  {
                    source: 'org_top_list',
                    target: 'industry_tab',
                    company_industry: item.name,
                    client: getClient(),
                });
            }

            if (item.value == 0 || item.value) {
                vm.industry = item.value == 0 ? '' : item.id;
                vm.industryIndex = item.value;
                if (item.value == 0){
                    $scope.isRise = true;
                } else {
                    $scope.isRise = false;
                }
                resetData();
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

}
