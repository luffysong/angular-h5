angular.module('defaultApp').constant('yearOptions', (function() {
    var years = [];
    var now = new Date().getFullYear() - 0;

    for (var i = now; i >= 1985; i--) {
        years.push(i + '');
    }

    return years;
})()).constant('monthOptions', (function() {
    var res = [];

    for (var i = 1; i <= 12; i++) {
        res.push(i + '');
    }

    return res;
})()).constant('seoInfo', {
    meta: {
        'url': '/api/p/sm/seo/summary/',
        filter_tag: ['title'],
        filter_name: ['keywords', 'description', 'author'],
        /*股权投资 详情*/
        'cf-detail': {
            tmlId: 'cf-detail'
        },
        /*股权投资 首页*/
        'cf-index': {
            tmlId: 'cf-index'
        },
        /*融资平台 公司粉丝*/
        'rong-comany-fans': {
            tmlId: 'rong-comany-fans'
        },
        /*融资平台 公司动态*/
        'rong-company-feeds': {
            tmlId: 'rong-company-feeds'
        },
        /*融资平台 公司融资详情*/
        'rong-company-finance': {
            tmlId: 'rong-company-finance'
        },
        /*融资平台 公司首页*/
        'rong-company-index': {
            tmlId: 'rong-company-index'
        },
        /*融资平台 公司总览*/
        'rong-company-overview': {
            tmlId: 'rong-company-overview'
        },
        /*融资平台 首页*/
        'rong-index': {
            tmlId: 'rong-index'
        },
        /*融资平台 机构详情页*/
        'rong-organization-detail': {
            tmlId: 'rong-organization-detail'
        },
        /* 融资平台 投资人/机构首页 */
        'rong-organization-index': {
            tmlId: 'rong-organization-index'
        },
        /* 融资平台 顶级机构详情页 */
        'rong-organizationtop-detail': {
            tmlId: 'rong-organizationtop-detail'
        },
        /* 融资平台 个人详情页*/
        'rong-user-detail': {
            tmlId: 'rong-user-detail'
        }


    }
});
