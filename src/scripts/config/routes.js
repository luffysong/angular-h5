var angular = require('angular');

angular.module('defaultApp').config(function ($locationProvider, $stateProvider, $urlRouterProvider, $provide, $sceDelegateProvider) {

    $sceDelegateProvider.resourceUrlWhitelist([
        'self'
    ]);

    //$provide.decorator('$uiViewScroll', function () {
    //    return function (uiViewElement) {
    //        setTimeout(function(){
    //            var top = uiViewElement.offset().top;
    //            if(uiViewElement.hasClass('main-content-wrap')){
    //                window.scrollTo(0, 0);
    //            }else {
    //                window.scrollTo(0, top-30);
    //            }
    //        },0)
    //    };
    //});

    $urlRouterProvider.otherwise('/404');

    $locationProvider.html5Mode(false);

    // $stateProvider.state('guide', {
    //     url: '/guide',
    //     templateUrl: 'templates/guide.html'
    //     // controller: 'CompanyDetailController'
    // });

    // 公司详情页
    $stateProvider.state('company_detail', {
        url: '/company/{id}',
        templateUrl: 'templates/company/detail.html',
        controller: 'CompanyDetailController'
    });
    // 用户详情页
    $stateProvider.state('user_detail', {
        url: '/user/{id}',
        templateUrl: 'templates/user/detail.html',
        controller: 'UserDetailController'
    });
    // 机构详情页
    $stateProvider.state('organization_detail', {
        url: '/organization/{id}',
        templateUrl: 'templates/organization/detail.html',
        controller: 'OrganizationDetailController'
    });

    $stateProvider.state('search', {
        url: '/search',
        templateUrl: 'templates/search/result.html',
        controller: 'SearchController'
    });

    // welcome
    $stateProvider.state('guide', {
        url: '/guide',
        template: '<div ui-view></div>'
    });

    $stateProvider.state('guide.welcome', {
        url: '/welcome',
        templateUrl: 'templates/guide/welcome.html',
        controller: 'GuideWelcomeController'
        // data: {
        //     permissions: {
        //         only: ['login']
        //     }
        // }
    });
    /*跟投人认证*/
    $stateProvider.state('investorValidate', {
        url: '/investorValidate',
        templateUrl: 'templates/investorValidate/index.html',
        controller: 'InvestorValidateController'
    });
});
