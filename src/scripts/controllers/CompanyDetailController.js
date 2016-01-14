/**
 * Controller Name: CompanyDetailController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('CompanyDetailController',
    function($scope, $location, $stateParams, $state, CompanyService, $timeout,
              UserService, ErrorService, $rootScope, DictionaryService,
              SocialService, CredentialService
              ) {
        var KR_DEFAULT_IMAGE = window.kr.defaultImg;
        var ZHONG_HOST = '//' + projectEnvConfig.zhongHost + kr.H5_PATH;
        var MOBILE_TYPE = {
            IOS:'IOS',
            ANDROID:'安卓',
        };
        var fundsApplyStatus = {
            APPLY:'等待创业者同意',
            REFUSE: '创业者已拒绝',
        };
        var API_STATUS = {
            FUNDS_NOT_DOING:100,
            NOT_INVESTOR:101,
            FUNDS_NOT_AOLLOW_VIEW:102,
            NOT_LOGIN: 403
        };
        var INVESTOR_TYPE = {
            INDIVIDUAL: 'INDIVIDUAL',
            ORGANIZATION: 'ORGANIZATION',
            COMPANY: 'COMPANY'
        };
        $timeout(function() {
            window.scroll(0, 0);
        }, 0);

        $scope.companyId = $stateParams.id || 12;

        initCapitalMeta();

        $scope.company = {
            value: {
                company:{},
                funds:{},
                basic:{},
            },
        };
        $scope.capitalDetail = {
            list:[],
        };

        $scope.fa = {};

        setMobileType();
        loadQichacha();

        $scope.getUISref = getUISref;

        $scope.existLinks = function() {
            return $scope.appLinks || $scope.company.value.company.webLink;
        };

        $scope.existProductIntro = function() {
            return $scope.slides.length ||
                $scope.existIntroDetail ||
                $scope.company.value.company.intro;
        };

        //众筹或者融资存在，没有权限的情况两个ID均不存在
        $scope.isFunding = function() {
            return $scope.company.value.funds.crowdFundingId || $scope.company.value.funds.fundsId;
        };

        //工商信息
        $scope.existBusiness = function() {
            return $scope.qichacha;
        };

        //设置系统种类
        function setMobileType() {
            $scope.mobileType = getMobileOperatingSystem();
        }

        function getMobileOperatingSystem() {
            var userAgent = navigator.userAgent || navigator.vendor || window.opera;

            if (isIos(userAgent)) {
                return MOBILE_TYPE.IOS;
            } else if (userAgent.match(/Android/i)) {
                return MOBILE_TYPE.ANDROID;
            } else {
                return 'unknown';
            }
        }

        function isIos(userAgent) {
            return userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i);
        }

        function setAppDownloadLink(company) {
            if ($scope.mobileType === MOBILE_TYPE.IOS) {
                $scope.appLink = company.iphoneAppstoreLink;
            }else if ($scope.mobileType === MOBILE_TYPE.ANDROID) {
                $scope.appLink = company.androidLink;
            }
        }

        function setCrowdFundingDetailUrl(crowdFundingId) {
            $scope.crowdFundingDetailUrl = ZHONG_HOST +
                'zhongchouDetail?source=rongzi&fundingId=' + crowdFundingId;
        }

        // 获取公司基本信息
        $scope.companyBasicData = function(callback) {
            CompanyService.get({
                id: $scope.companyId,
            }, function(data) {
                console.log('--请求的数据--', data);
                var isIpoOrAcquiredReg = /IPO|ACQUIRED/;
                $scope.company.value = data;
                $scope.funds = data.funds;
                $scope.teamTags = data.teamTags;
                $scope.isIpoOrAcquired = isIpoOrAcquiredReg.test(data.funds.phase);
                introProduct(data.company);
                setAppDownloadLink(data.company);
                setCrowdFundingDetailUrl(data.funds.crowdFundingId);
                if (data.funds.crowdFundingId) {
                    loadCrowdFundingDetail(data.funds.crowdFundingId);
                }

                if (data.company.faId) {
                    loadFa(data.company.faId);
                }

                document.title = data.basic.name + ' | 36氪';
                window.WEIXINSHARE = {
                    shareTitle: data.basic.name + ' | 36氪',
                    shareDesc: data.basic.brief || data.basic.name,
                    shareImg: data.basic.logo ||
                    'http://img.36tr.com/logo/20140520/537aecb26e02d',
                };
                window.InitWeixin();

                if (callback) {
                    callback(data);
                }

            }, angular.noop);
        };

        $scope.isManager = function(id) {
            if ($scope.company.value.basic) {
                return $scope.company.value.basic.managerId === id;
            }

            return false;

        };

        var productMeta = [{
            propName: 'projectAdvantage',
            title: '我们的产品与优势',
            className: 'intro-icon-product',
        }, {
            propName: 'dataLights',
            title: '我们的用户',
            className: 'intro-icon-user',
        }, {
            propName: 'projectPlan',
            title: '未来的我们',
            className: 'intro-icon-future',
        }, {
            propName: 'competitor',
            title: '与我们相似的产品',
            className: 'intro-icon-same',
        }, {
            propName: 'intro',
            title: '其他',
            className: 'intro-icon-other',
        }];

        //产品介绍
        function introProduct(company) {
            var productIntro = [];
            var existIntroDetail = false;
            var item;
            var i;
            var l;
            for (i = 0, l = productMeta.length; i < l; i++) {
                item = productMeta[i];
                if (company[item.propName]) {
                    if (!existIntroDetail && item.propName !== 'intro') {
                        existIntroDetail = true;
                    }

                    productIntro.push({
                        text: company[item.propName],
                        title: item.title,
                        className: item.className,
                    });
                }
            }

            $scope.existIntroDetail = existIntroDetail;
            $scope.productIntroData = productIntro;
        }

        $scope.slides = [];
        $scope.companyBasicData(function() {

            var slides = $scope.slides;
            if ($scope.company.value.company.video) {
                slides.push({
                    video: $scope.company.value.company.video,
                    image: KR_DEFAULT_IMAGE.defaultVideoUrl,
                });

            }

            $scope.addSlide = function(i) {
                slides.push({
                    image: $scope.company.value.other.pictures[i],
                });
            };

            for (var i = 0; i < $scope.company.value.other.pictures.length; i++) {
                $scope.addSlide(i);
            }
        });

        function loadCrowdFundingDetail(id) {
            CompanyService.getCrowdFunding({
                id:id
            }, function(data) {
                $scope.funds.phase = data.funding.round;
                $scope.funds.unit = 'CNY';

                //jscs:disable requireCamelCaseOrUpperCaseIdentifiers
                $scope.funds.value = data.funding.cf_raising;
                $scope.company.value.funds.shares = data.funding.sell_shares.replace('%', '');

            });
        }

        getFeeds();

        //公司动态
        function getFeeds() {
            CompanyService.feed.get({
                id: $scope.companyId,
            }, function(data) {
                $scope.originFeedsCount = data.data.length;
                $scope.feeds = data.data.slice(0, 3);
            });
        }

        //fa

        function loadFa(id) {
            UserService.basic.get({
                id:id
            }, function(data) {
                $scope.fa = data;
            });
        }

        // 创始团队
        $scope.founder = {
            list: [],
            listLimit: 2,
        };
        loadFounderData();

        function loadFounderData(callback) {
            CompanyService.founder.query({
                id: $scope.companyId,
            }, function(data) {
                $scope.founder.list = data.data;
                callback &&  callback(data);
            }, function(err) {

                ErrorService.alert(err);
            });
        }

        //获取融资经历数据
        $scope.finance = {
            list: [],
            listLimit: 2,
        };
        loadFinanceData();
        loadCapitalDetail();

        //过往融资经历
        function loadFinanceData(callback) {

            CompanyService['past-finance'].query({
                id: $scope.companyId,
            }, function(data) {
                $scope.finance.originListCount = data.data.length;
                $scope.finance.list = data.data.slice(0, 1);
                callback && callback(data);
            }, function(err) {

                ErrorService.alert(err);
            });
        }

        function getUISref(type, id) {
            if (type === INVESTOR_TYPE.ORGANIZATION) {
                return $state.href('organization_detail', { id: id });
            }else if (type === INVESTOR_TYPE.INDIVIDUAL) {
                return $state.href('user_detail', { id: id });
            }else {
                return $state.href('companyDetail', { id: id });
            }
        }

        //获取融资详情
        function loadCapitalDetail(callback) {
            CompanyService.funds.get({
                id: $scope.companyId,
            }, function(data) {
                $scope.capitalDetail = data;
                setCapitalList();
                callback && callback();
            }, function(data) {

                setApplyState(data);
            });
        }

        function setCapitalList() {
            $scope.capitalDetail.list = [];
            for (var i = 0, l = $scope.capitalQs.length; i < l; i++) {
                var q = $scope.capitalQs[i];
                if ($scope.capitalDetail[q.propName]) {
                    $scope.capitalDetail.list.push({
                        question:q.text,
                        answer:$scope.capitalDetail[q.propName],
                    });
                }
            }
        }

        function initCapitalMeta() {
            var questions = [
                {
                    propName: 'scale',
                    text: '你的目标市场规模及分析？',
                }, {
                    propName: 'dataLights',
                    text: '用户需求切入点，及现有业务数据亮点？',
                }, {
                    propName: 'competitor',
                    text: '主要竞争对手情况及国内外标杆（如有）？',
                }, {
                    propName: 'projectAdvantage',
                    text: '你的项目的主要优势？',
                }, {
                    propName: 'projectPlan',
                    text: '下一步发展规划及长期愿景？',
                },
            ];
            $scope.capitalQs = questions;
        }

        function loadQichacha() {
            CompanyService.qichacha.get({
                id:$scope.companyId,
            }, function(data) {
                $scope.qichacha = !!data.Name;
            });

        }

        function setApplyState(data) {
            if (data.code === API_STATUS.FUNDS_NOT_AOLLOW_VIEW) {
                $scope.needApply = true;
                $scope.applyStarted =  !!data.data.applyStatus;
                $scope.applyStateText = fundsApplyStatus[data.data.applyStatus];
                $scope.applyStateText = $scope.applyStateText || '申请查看';
            }else if (data.code === API_STATUS.NOT_INVESTOR) {
                $scope.notInvestor = true;
            }else if (data.code === API_STATUS.FUNDS_NOT_DOING) {

                //获得公司
                $scope.notFunding = true;
            }
        }

        function ensureLogin() {
            if (!UserService.getUID()) {
                CredentialService.directToLogin();
            }
        }

        //Event Handelr

        $scope.likeClick = function(isLike, e) {
            e.preventDefault();
            ensureLogin();
            if (!isLike) {
                SocialService.likes.yes({
                    id:$scope.companyId,
                }, {
                }, function(data) {
                    setLikeState(data, isLike);
                });
            }else {
                SocialService.likes.no({
                    id:$scope.companyId,
                }, function(data) {
                    setLikeState(data, isLike);
                });
            }
        };

        $scope.followClick = function(followed, e) {
            e.preventDefault();
            ensureLogin();
            if (!followed) {
                SocialService.follow.yes({
                    id:$scope.companyId,
                }, {

                }, function(data) {
                    setFollowState(data, followed);
                });
            }else {
                SocialService.follow.no({
                    id:$scope.companyId,
                }, {

                }, function(data) {
                    setFollowState(data, followed);
                });
            }
        };

        $scope.applyViewClick = function(e) {
            e.preventDefault();
            if ($scope.needApply && !$scope.applyStarted) {
                $scope.applyStarted = true;
                $scope.applyStateText = fundsApplyStatus.APPLY;
                CompanyService.funds.applyView({
                    id:$scope.companyId,
                }, { });
            }
        };

        $scope.buyOrTalkClick = function(type, e) {
            e.preventDefault();
            if (type === 'buy') {
                location.href = $scope.crowdFundingDetailUrl;
            }else {
                showAppDownload();
            }
        };

        $scope.cancellDownloadClick = function(e) {
            e.preventDefault();
            cancellDownload();

        };

        function showAppDownload() {
            $scope.showAppDownload = true;
        }

        function cancellDownload() {
            $scope.showAppDownload = false;
        }

        function setLikeState(apiData, isLike) {
            $scope.company.value.isLikes = !isLike;
            var count = !isLike ? 1 : -1;
            $scope.company.value.statistics.likesCount += count;
        }

        function setFollowState(apiData, followed) {
            $scope.company.value.followed = !followed;
            var count = !followed ? 1 : -1;
            $scope.company.value.statistics.followCount += count;
        }

    });

