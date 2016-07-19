
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

    //项目集
    $stateProvider.state('demos', {
        url:'/demos/:id',
        controllerAs: 'vm',
        controller: 'DemosController',
        templateUrl: 'templates/demos/index.html',
        resolve: {
            demos: loadDemos
        }
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

    function loadDemos(demosService, $stateParams, $rootScope, loading) {
        $rootScope.needLoading = true;
        loading.show('demos');
        return demosService.getDemos($stateParams.id)
            .catch(function demosFail(data) {
                return data.data;
            });
    }

});
