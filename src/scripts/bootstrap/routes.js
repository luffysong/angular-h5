
var angular = require('angular');
angular.module('defaultApp').config(function ($locationProvider, $stateProvider, $urlRouterProvider, $provide, $sceDelegateProvider) {

    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
    ]);

    $urlRouterProvider.otherwise('/404');

    $locationProvider.html5Mode(false);

    var RONG_HOST = projectEnvConfig.rongHost;

    var PC_BASE_URL = '//' + RONG_HOST + '/';

    // 公司详情页
    $stateProvider.state('companyDetail', {
        url: '/company/{id}',
        templateUrl: 'templates/company/detail.html',
        controller: 'CompanyDetailController',
    });

    $stateProvider.state('company_detail', {
        url: '/company/{id}',
        templateUrl: 'templates/company/detail.html',
        controller: 'CompanyDetailController',
    });

    $stateProvider.state('companyDetailTips', {
        url: '/company/{id}/tips',
        templateUrl: 'templates/company/company-tips-full.html',
        controller: 'CompanyTipsController',
    });

    $stateProvider.state('companyDetailCapitalHistory', {
        url: '/company/{id}/capital',
        templateUrl: 'templates/company/company-capital-history-full.html',
        controller: 'CompanyCapitalHistoryController',
    });

    $stateProvider.state('companyDetailQichacha', {
        url: '/company/{id}/qichacha',
        templateUrl: 'templates/company/company-qichacha.html',
        controller: 'CompanyQichachaController',
    });

    // 用户详情页
    $stateProvider.state('user_detail', {
        url: '/user/{id}',
        templateUrl: 'templates/user/detail.html',
        controller: 'UserDetailController',
    });

    $stateProvider.state('search', {
        url: '/search',
        templateUrl: 'templates/search/result.html',
        controller: 'SearchController',
    });

    // welcome
    $stateProvider.state('guide', {
        url: '/guide',
        template: '<div ui-view></div>',
    });

    $stateProvider.state('guide.welcome', {
        url: '/welcome?{from}',
        templateUrl: 'templates/guide/welcome.html',
        controller: 'GuideWelcomeController',
        data:{
            permissions: {
                only: ['login'],
            },
        },
    });

    /*投资人认证申请*/
    $stateProvider.state('investorValidateApply', {
        url: '/investor/apply',
        templateUrl: 'templates/investor/apply.html',
        controller: 'InvestorValidateApplyController',
        data:{
            permissions: {
                only: ['login'],
            },
        },
    });

    /*创建公司*/
    $stateProvider.state('createCompany', {
        url: '/company_create?{from}',
        templateUrl: 'templates/company/create.html',
        controller: 'CreateCompanyController',
        data:{
            permissions: {
                only: ['valid'],
            },
        },
    });
    /*创建公司审核页*/
    $stateProvider.state('createCompanyApply', {
        url: '/company_create_apply?{from}&{cid}',
        templateUrl: 'templates/company/create-apply-alert.html',
        controller: 'CreateApplyController'
    });

    // 我管理的公司
    $stateProvider.state('myCompany', {
        url: '/my_company?{from}',
        templateUrl: 'templates/company/my-company.html',
        controller: 'MyCompanyController',
        data:{
            permissions: {
                only: ['valid'],
            },
        },
    });

    //极速融资产品化
    $stateProvider.state('extreme', {
        url: '/extreme',
        abstract: true,
        template: '<div ui-view></div>'
    });

    $stateProvider.state('extreme.join', {
        url: '/join/{id}',
        controller: 'ExtremeIndexController',
        templateUrl: 'templates/extreme/investor-join.html',
        onEnter: function (DeviceService, $stateParams) {
            document.title = '极速融资2.0|投资人报名';
            if (!DeviceService.isMobile()) {
                location.href = PC_BASE_URL + 'extreme/join/' + $stateParams.id;
            }
        }
    });

    // 我要融资-提交成功
    $stateProvider.state('finacingSuccess', {
        url: '/finacing_success?{from}&{cid}',
        templateUrl: 'templates/company/finacing-success.html',
        controller: 'FinacingSuccessController'
    });

    //快速认领
    $stateProvider.state('fastClaim', {
        url:'/claim/:id',
        controller: 'ClaimController',
        controllerAs: 'vm',
        templateUrl: 'templates/claim/index.html',
        resolve: { /* @ngInjection */
            user: checkClaimStatus
        }
    });

    //机构页
    $stateProvider.state('organization', {
        url:'/org/:id',
        controllerAs: 'vm',
        controller: 'OrganizationDetailController',
        templateUrl: 'templates/organization/index.html',
        resolve: {
            orgInfo: loadOrgBasic,
            investments: loadOrgInvestments
        }
    });

    // 项目集
    $stateProvider.state('demos', {
        url:'/demos/:id?type',
        controllerAs: 'vm',
        controller: 'DemosController',
        templateUrl: 'templates/demos/index.html',
        resolve: {
            cover: loadCover
        }
    });

    //创投助手app---发现页
    $stateProvider.state('find', {
        url: '/find',
        abstract: true,
        template: '<div ui-view></div>'
    });

    //创投助手app---媒体热议
    $stateProvider.state('find.dailyNews', {
        url:'/dailyNews',
        controllerAs: 'vm',
        controller: 'DailyNewsController',
        templateUrl: 'templates/find/dailyNewsList.html',
        resolve: {
            coverFind: loadFind
        }
    });

    // 创投助手app---项目专辑
    $stateProvider.state('find.projectAlbum', {
        url:'/projectAlbum',
        abstract: true,
        template: '<div ui-view></div>'
    });

    //创投助手app---项目专辑---路演日历
    $stateProvider.state('roadShow', {
        url:'/roadShow',
        controllerAs: 'vm',
        controller: 'RoadShowController',
        templateUrl: 'templates/find/roadShowList.html',
        resolve: {
            coverFind: loadFind,
        }
    });

    //创投助手app---项目专辑---机构在融 + HUNTING+ + 限时首发
    $stateProvider.state('find.projectAlbum.normal', {
        url:'/:type',
        controllerAs: 'vm',
        controller: 'RoadShowController',
        templateUrl: 'templates/find/projectAlbumNormal.html',
    });

    // 创投助手app---关注热点
    $stateProvider.state('find.hotFocus', {
        url:'/hotFocus?eventEnum&intervalEnum',
        controllerAs: 'vm',
        controller: 'HotFocusController',
        templateUrl: 'templates/find/hotFocus.html'
    });

    // 创投助手app---热点详情
    $stateProvider.state('find.hotFocusDetail', {
        url:'/hotFocusDetail/:id?eventEnum&intervalEnum&title',
        controllerAs: 'vm',
        controller: 'HotFocusDetailController',
        templateUrl: 'templates/find/hotFocusDetail.html'
    });

    //创投助手app---投资热点
    $stateProvider.state('find.hotSpot', {
        url:'/hotSpot',
        controllerAs: 'vm',
        controller: 'HotSpotController',
        templateUrl: 'templates/find/hotSpotList.html',
        resolve: {
            coverFind: loadFind
        }
    });

    //创投助手app---投资热点tab分页
    $stateProvider.state('find.hotSpotTab', {
        url:'/hotSpotTab',
        controllerAs: 'vm',
        controller: 'HotSpotTabController',
        templateUrl: 'templates/find/hotSpotTab.html',
        resolve: {
            coverFind: loadFind
        }
    });

    //创投助手app---融资速递
    $stateProvider.state('find.finance', {
        url:'/finance',
        controllerAs: 'vm',
        controller: 'FinanceController',
        templateUrl: 'templates/find/financeList.html',
        resolve: {
            coverFind: loadFind
        }
    });

    //创投助手app---分享页(热点追踪|路演日历)
    $stateProvider.state('find.share', {
        url:'/share/:id',
        controllerAs: 'vm',
        controller: 'ShareController',
        templateUrl: 'templates/find/share.html',
        resolve: {
            coverFind: loadFind
        }
    });

    //创投助手app---活动页(氪空间)
    $stateProvider.state('findKrspace', {
        url:'/findKrspace?activityName',
        controller: 'ActivityIndexController',
        controllerAs: 'vm',
        templateUrl: 'templates/activity/krspace.html',
    });

    //创投助手app---活动页(wise)
    $stateProvider.state('findWise', {
        url:'/findWise?activityName',
        controller: 'ActivityIndexController',
        controllerAs: 'vm',
        templateUrl: 'templates/activity/wise.html',
    });

    //-----------------------
    //前台活动展示h5页面
    $stateProvider.state('fractivity', {
        url:'/fractivity?activityName',
        controllerAs: 'vm',
        controller: 'FrActivityController',
        templateUrl: 'templates/fractivity/index.html',
    });

    //投资人注册
    $stateProvider.state('frInvestor', {
        url:'/frInvestor?activityName',
        controllerAs: 'vm',
        controller: 'FrInvestorController',
        templateUrl: 'templates/fractivity/investor.html',
    });

    //成功页面
    $stateProvider.state('frInvestorSuccess', {
        url:'/frInvestor?activityName',
        controllerAs: 'vm',
        controller: 'FrInvestorSucessController',
        templateUrl: 'templates/fractivity/investorSuccess.html',
    });

    //创业者注册
    $stateProvider.state('findStartUp', {
        url:'/findStartUp?activityName',
        controllerAs: 'vm',
        controller: 'FrStartUpController',
        templateUrl: 'templates/fractivity/startup.html',
    });

    //创业者成功
    $stateProvider.state('findStartUpSuccess', {
        url:'/findStartUpSuccess?activityName',
        controllerAs: 'vm',
        controller: 'FrStartupSuccessController',
        templateUrl: 'templates/fractivity/startupSuccess.html',
    });

    //创投助手app---活动页(ideaBank)
    $stateProvider.state('findIdeaBank', {
        url:'/findIdeaBank?activityName',
        controller: 'ActivityIndexController',
        controllerAs: 'vm',
        templateUrl: 'templates/activity/ideaBank.html',
    });

    //创投助手app---活动页(firstWine)元旦
    $stateProvider.state('firstWine', {
        url:'/firstWine?activityName',
        controller: 'ActivityIndexController',
        controllerAs: 'vm',
        templateUrl: 'templates/activity/firstWine.html',
    });

    //创投助手app---活动页(wonderland)
    $stateProvider.state('wonderland', {
        url:'/wonderland?activityName',
        controller: 'ActivityIndexController',
        controllerAs: 'vm',
        templateUrl: 'templates/activity/wonderland.html',
    });

    //创投助手app---活动页(wonderland)
    $stateProvider.state('findMusicRoadshow', {
        url:'/findMusicRoadshow?activityName',
        controller: 'ActivityIndexController',
        controllerAs: 'vm',
        templateUrl: 'templates/activity/musicRoadshow.html',
    });

    //创投助手app---活动页登陆
    $stateProvider.state('findLogin', {
        url:'/findLogin?activityName&type',
        controller: 'LoginController',
        controllerAs: 'vm',
        templateUrl: 'templates/activity/login.html',
    });

    //创投助手app---活动页登陆成功
    $stateProvider.state('findLoginSuccess', {
        url:'/findLoginSuccess?activityName',
        controller: 'LoginSuccessController',
        controllerAs: 'vm',
        templateUrl: 'templates/activity/loginSuccess.html',
    });

    //创投助手app---活动页投资人认证
    $stateProvider.state('findInvestor', {
        url:'/findInvestor?activityName',
        controller: 'InvestorController',
        templateUrl: 'templates/activity/investor.html',
    });

    //创投助手app---活动页投资人认证成功
    $stateProvider.state('findInvestorSuccess', {
        url:'/findInvestorSuccess?activityName',
        controller: 'InvestorSuccessController',
        controllerAs: 'vm',
        templateUrl: 'templates/activity/investorSuccess.html',
    });

    function checkClaimStatus(ClaimService, $stateParams) {
        return ClaimService.check($stateParams.id);
    }

    function loadOrgBasic(OrganizationService, $stateParams) {
        return OrganizationService.basic.get({
            id: $stateParams.id
        }).$promise;
    }

    function loadOrgInvestments(OrganizationService, $stateParams) {
        return OrganizationService['past-investment'].get({
                id: $stateParams.id,
                page: 1,
                pageSize: 20
            }).$promise;
    }

    function loadCover(demosService, projectColumnService, $stateParams, $rootScope, loading) {
        var NOT_AUTHORIZE = 401;

        $rootScope.needLoading = true;
        loading.show('demos');
        $('ui-view')[0].innerHTML = '';
        var dataPromise;
        if ($stateParams.type === 'column') {
            dataPromise = getColumns();
        } else {
            dataPromise = getDemos();
        }

        dataPromise = dataPromise
            .then(function getImageUrl(data) {
                return data;
            })
            .catch(function demosFail(data) {
                return {
                    code: NOT_AUTHORIZE,
                    data: data.data
                };
            });

        return dataPromise;

        function getDemos() {
            return demosService.getBaseInfo($stateParams.id);
        }

        function getColumns() {
            return projectColumnService.getColumn($stateParams.id);
        }

    }

    function loadFind($rootScope, loading, $q, $timeout) {
        $rootScope.findNeedLoading = true;
        loading.show('findLoading');
        $('ui-view')[0].innerHTML = '';

        var deferred = $q.defer();  //通过$q服务注册一个延迟对象 deferred
        var promise = deferred.promise;  //通过deferred延迟对象，可以得到一个承诺promise，而promise会返回当前任务的完成结果
        $timeout(function () {
            deferred.resolve();
        }, 10);

        return promise;
    }
});
