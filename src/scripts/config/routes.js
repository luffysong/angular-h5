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
        url: '/welcome?{from}&{type}',
        templateUrl: 'templates/guide/welcome.html',
        controller: 'GuideWelcomeController',
        data:{
            permissions : {
                only : ['login']
            }
        }
    });


    /*众筹首页*/
    $stateProvider.state('syndicates', {
        url: '/zhongchou',
        templateUrl: 'templates/syndicates/index.html',
        controller: 'syndicatesController'
    });
    /*众筹详情*/
    $stateProvider.state('syndicatesDetail', {
        url: '/zhongchouDetail?companyId&fundingId&login&source',
        templateUrl: 'templates/syndicates/detail.html',
        controller: 'syndicatesDetailController'
    });
    /*众筹确定金额页面*/
    $stateProvider.state('syndicatesConfirm', {
        url: '/zhongchouConfirm/{cid}/{fundingId}',
        templateUrl: 'templates/syndicates/confirm.html',
        controller: 'syndicatesConfirmController',
        data:{
            permissions : {
                only : ['valid']
            }
        }
    });
    /*众筹订单页面*/
    $stateProvider.state('syndicatesOrder', {
        url: '/zhongchouOrder/{cid}/{fundingId}',
        templateUrl: 'templates/syndicates/order.html',
        controller: 'syndicatesOrderController'/*,
        data:{
            permissions : {
                only : ['valid']
            }
        }*/
    });
    /*众筹个人所有订单页面*/
    $stateProvider.state('syndicatesAllOrder', {
        url: '/zhongchouAllOrder',
        templateUrl: 'templates/syndicates/allOrder.html',
        controller: 'syndicatesAllOrderController'/*,
         data:{
         permissions : {
         only : ['valid']
         }
         }*/
    });
    /*众筹选择支付方式页面*/
    $stateProvider.state('syndicatesPayWay', {
        url: '/zhongchouPayWay/{tid}/{amount}',
        templateUrl: 'templates/syndicates/payWay.html',
        controller: 'syndicatesPayWayController'/*,
         data:{
         permissions : {
         only : ['valid']
         }
         }*/
    });
    /*众筹支付页面*/
    $stateProvider.state('syndicatesPay', {
        url: '/zhongchouPay/{tid}/{amount}',
        templateUrl: 'templates/syndicates/pay.html',
        controller: 'syndicatesPayController'/*,
        data:{
            permissions : {
                only : ['valid']
            }
        }*/
    });
    /*众筹支付成功页面*/
    $stateProvider.state('syndicatesSuc', {
        url: '/zhongchouSuc?cid&fundingId',
        templateUrl: 'templates/syndicates/suc.html',
        controller: 'syndicatesSucController',
        data:{
            permissions : {
                only : ['valid']
            }
        }
    });
    /*跟投人认证*/
    $stateProvider.state('investorValidate', {
        url: '/investorValidate?type',
        templateUrl: 'templates/investorValidate/index.html',
        controller: 'InvestorValidateController',
        data:{
            permissions : {
                only : ['valid']
            }
        }
    });
    /*投资人认证申请*/
    $stateProvider.state('investorValidateApply', {
        url: '/investor/apply',
        templateUrl: 'templates/investor/apply.html',
        controller: 'InvestorValidateApplyController',
        data:{
            permissions : {
                only : ['valid']
            }
        }
    });
    /*协议路由，用户服务协议*/
    $stateProvider.state('serviceProtocol', {
        url: '/serviceProtocol',
        templateUrl: 'templates/protocol/serviceProtocol.html',
        controller:function(){
            setTimeout(function(){
                window.scroll(0,0);
            },0);
        }
    });
    /*协议路由，风险揭示书协议*/
    $stateProvider.state('riskTip', {
        url: '/riskTip',
        templateUrl: 'templates/protocol/riskTip.html',
        controller:function(){
            setTimeout(function(){
                window.scroll(0,0);
            },0);
        }
    });

    /*创建公司*/
    $stateProvider.state('createCompany', {
        url: '/company_create',
        templateUrl: 'templates/company/create.html',  // todo : 文件路径
        controller: 'CreateCompanyController', // todo : controller
        data:{
            permissions : {
                only : ['valid']
            }
        }
    });
    /*创建公司审核页*/
    $stateProvider.state('createCompanyApply', {
        url: '/company_create_apply',
        templateUrl: 'templates/company/create-apply-alert.html' // todo : 文件路径
        //controller: 'CreateCompanyController' // todo : controller
    });

    $stateProvider.state('riskTipAll', {
        url: '/riskTipAll',
        templateUrl: 'templates/protocol/riskTip_all.html'
    });
});
