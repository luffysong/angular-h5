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

    /*众筹所有模块*/

    /*新闻公告模块*/
    $stateProvider.state('syndicatesNews', {
        url: '/zhongchouNews',
        templateUrl: 'templates/syndicates/news/index.html',
        controller: 'syndicatesNewsController'
    });
    /*新闻详情模块*/
    $stateProvider.state('syndicatesNewsDetail', {
        url: '/zhongchouNewsDetail?{id}',
        templateUrl: 'templates/syndicates/news/detail.html',
        controller: 'syndicatesNewsDetailController'
    });

    /*新人课堂*/
    $stateProvider.state('syndicatesClass', {
        url: '/zhongchouClass',
        templateUrl: 'templates/syndicates/class.html',
        controller: 'syndicatesClassController'
    });

    /*我要上众筹活动*/
    $stateProvider.state('syndicatesDesire', {
        url: '/zhongchouDesire',
        templateUrl: 'templates/syndicates/desire.html',
        controller: 'syndicatesDesireController'
    });
    /*我要上众筹活动公司详情*/
    $stateProvider.state('syndicatesDesireDetail', {
        url: '/zhongchouDesireDetail?id=',
        templateUrl: 'templates/syndicates/desire/detail.html',
        controller: 'syndicatesDesireDetailController'
    });
    /*众筹首页*/
    $stateProvider.state('syndicates', {
        url: '/zhongchou',
        templateUrl: 'templates/syndicates/index.html',
        controller: 'syndicatesController'
    });
    /*众筹详情*/
    $stateProvider.state('syndicatesDetail', {
        url: '/zhongchouDetail?companyId&fundingId&login&source&checkValid',
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
    /*众筹确定金额页面*/
    $stateProvider.state('syndicatesKrCode', {
        url: '/zhongchouCode/{fundingId}/{cid}',
        templateUrl: 'templates/syndicates/kr-code.html',
        controller: 'syndicatesCodeController',
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
   $urlRouterProvider.when('/zhongchouAllOrder', '/zhongchouAllOrder/all');
    $stateProvider.state('zhongchouAllOrder', {
        url: '/zhongchouAllOrder',
        templateUrl: 'templates/syndicates/allOrder.html',
        controller: 'syndicatesAllOrderController'
//      data:{
//          permissions : {
//              only : ['valid']
//          }
//      }
    });
     $stateProvider.state('zhongchouAllOrder.all', {
        url: '/all',
        templateUrl: 'templates/syndicates/allOrder.html',
        controller: 'syndicatesAllOrderController'
    });
    $stateProvider.state('zhongchouAllOrder.obligations', {
        url: '/obligations',
        templateUrl: 'templates/syndicates/allOrder.html',
        controller: 'syndicatesAllOrderController'
    });
    $stateProvider.state('zhongchouAllOrder.paid', {
        url: '/paid',
        templateUrl: 'templates/syndicates/allOrder.html',
        controller: 'syndicatesAllOrderController'
    });


    /*众筹选择支付方式页面*/
    $stateProvider.state('syndicatesPayWay', {
        url: '/zhongchouPayWay/{tid}?type&ids&calAmount',
        templateUrl: 'templates/syndicates/payWay.html',
        controller: 'syndicatesPayWayController'/*,
         data:{
         permissions : {
         only : ['valid']
         }
         }*/
    });
    /*优惠劵页面*/
    $stateProvider.state('syndicatesCoupon', {
        url: '/zhongchouCoupon/{tid}?{ids}',
        templateUrl: 'templates/syndicates/coupon.html',
        controller: 'syndicatesCouponController'
    });
    /*众筹支付页面*/
    $stateProvider.state('syndicatesPay', {
        url: '/zhongchouPay/{tid}/{amount}?type&ids',
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

    /*线下支付页面*/
    $stateProvider.state('syndicatesPayOutline', {
        url: '/zhongchouPayOutline?{tid}&{type}&{couponIds}',
        templateUrl: 'templates/syndicates/pay-outline.html',
        controller: 'syndicatesPayOutlineController'
    });
    $stateProvider.state('payOutlineRemind', {
        url: '/zhongchouPayOutlineRemind?{tid}&{type}&{couponIds}',
        templateUrl: 'templates/syndicates/pay-outline-remind.html',
        controller: 'payOutlineRemindController'
    });
    /*跟投人认证*/
    $stateProvider.state('investorValidate', {
        url: '/investorValidate?type&source&krsrc',
        templateUrl: 'templates/investorValidate/index.html',
        controller: 'InvestorValidateController'
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
        url: '/company_create?{from}',
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
        url: '/company_create_apply?{from}&{cid}',
        templateUrl: 'templates/company/create-apply-alert.html', // todo : 文件路径
        controller: 'CreateApplyController' // todo : controller
    });

    $stateProvider.state('riskTipAll', {
        url: '/riskTipAll',
        templateUrl: 'templates/protocol/riskTip_all.html'
    });

    /**
     * 手续进度管理
     */
    $stateProvider.state('procedure', {
        url: '/procedure?cfid',
        templateUrl: 'templates/syndicates/procedure.html',
        controller: 'SyndicatesProcedureController'
    });
    // 我管理的公司
    $stateProvider.state('myCompany', {
        url: '/my_company?{from}',
        templateUrl: 'templates/company/my-company.html', // todo : 文件路径
        controller: 'MyCompanyController', // todo : controller
        data:{
            permissions : {
                only : ['valid']
            }
        }
    });

    // 我要融资-提交成功
    $stateProvider.state('finacingSuccess', {
        url: '/finacing_success?{from}&{cid}',
        templateUrl: 'templates/company/finacing-success.html', // todo : 文件路径
        controller: 'FinacingSuccessController' // todo : controller
    });

    /**
     * 跟投人拉新活动
     */
    $stateProvider.state('syndicatesInvite', {
        url: '/syndicatesInvite?id',
        templateUrl: 'templates/syndicates/invite/index.html',
        controller: 'SyndicatesInviteController'
    });

    $stateProvider.state('syndicatesValidate', {
        url: '/syndicatesValidate?{inviter_id}&{activity_id}&source&krsrc',
        templateUrl: 'templates/syndicates/invite/validate.html',
        controller: 'syndicatesValidateController',
        data:{
            permissions : {
                only : ['login']
            }
        }
    });

    $stateProvider.state('syndicatesShare', {
        url: '/syndicatesShare',
        templateUrl: 'templates/syndicates/invite/share.html',
        controller: 'SyndicatesShareController',
        data:{
            permissions : {
                only : ['login']
            }
        }
    });

        /**
     * 大公司合作推广
     * */

    $stateProvider.state('syndicatesCompany', {
        url: '/syndicatesCompany?{activity_id}&{skipstep}',
        templateUrl: 'templates/syndicates/company/index.html',
        controller: 'syndicatesCompanyController'
    });
    $stateProvider.state('syndicatesCompanyGift', {
        url: '/syndicatesCompanyGift?{id}',
        templateUrl: 'templates/syndicates/company/gift.html',
        controller: 'syndicatesCompanyGiftController'
    });
    $stateProvider.state('syndicatesGift', {
        url: '/syndicatesGift?id',
        templateUrl: 'templates/syndicates/invite/gift.html',
        controller: 'SyndicatesGiftController',
        data:{
            permissions : {
                only : ['login']
            }
        }
    });
});
