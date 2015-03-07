var angular = require('angular');

angular.module('defaultApp').config(function ($locationProvider, $stateProvider, $urlRouterProvider, $provide, $sceDelegateProvider) {

    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self'
        // Allow loading from our assets domain.  Notice the difference between * and **.
        //'http://*./**'
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

    // 公司详情页
    $stateProvider.state('company_detail', {
        url: '/company/{id}/overview',
        templateUrl: 'templates/company/detail.html',
        controller: 'CompanyDetailController'
    });
    // 用户详情页
    $stateProvider.state('user_detail', {
        url: '/user/{id}/overview',
        templateUrl: 'templates/user/detail.html',
        controller: 'UserDetailController'
    });
    // 机构详情页
    $stateProvider.state('organization_detail', {
        url: '/organization/{id}/overview',
        templateUrl: 'templates/organization/detail.html',
        controller: 'OrganizationDetailController'
    });

});
