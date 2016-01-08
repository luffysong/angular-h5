angular.module('defaultApp.mocks').run(function($httpBackend) {

    $httpBackend.whenGET(/^\/api\/user\/\d+\/finacing/).respond(200, {
        "code": 0,
        "data": {
            "data": [
                {
                    "cid": 1065,
                    "createDate": 1423134699000,
                    "deleteStatus": 1,
                    "company":{
                        id:12,
                        name: "xxx",
                        logo: ""
                    },
                    "details": [
                        {
                            "cid": 1065,
                            "createDate": 1423134699000,
                            "deleteStatus": 1,
                            "entityId": 115,
                            "entityType": "INDIVIDUAL",
                            "financeEventId": 23,
                            "id": 23,
                            "investDate": 1393603200000,
                            "logo": "https://krplus.b0.upaiyun.com/201502/05172722/@拉依库兹出品 (7).jpg",
                            "name": "海南111",
                            "phase": "ANGEL",
                            "source": "ADMIN",
                            "status": "PENDING",
                            "updateDate": -62135798400000
                        }
                    ],
                    "estimateValue": "asdf",
                    "estimateValueUnit": "USD",
                    "financeDate": 1393603200000,
                    "financeValue": "asd",
                    "financeValueUnit": "CNY",
                    "id": 23,
                    "isProcessed": 0,
                    "isPublic": 1,
                    "phase": "ANGEL",
                    "source": "ADMIN",
                    "status": "PENDING",
                    "updateDate": -62135798400000
                }
            ],
            "limit": 20,
            "offset": 0,
            "page": 1,
            "pageSize": 20,
            "totalCount": 1,
            "totalPages": 1
        },
        "msg": "success"
    });
    $httpBackend.whenGET(/^\/api\/user\/\d+\/company/).respond(200, {
        "code": 0,
        "data": {
            "expList": [{
                "brief": "服务于本地社区的数字社区",
                "endDate": 1422720027000,
                "groupId": 474,
                "groupIdType": 3,
                "groupName": "申邻里",
                "id": 10,
                "isComfirmed": false,
                "isCurrent": true,
                "logo": "http://placehold.it/40x40/09f/fff",
                "position": 'FOUNDER',
                "positionDetail": "CTO",
                "startDate": 1406822400000,
                "uid": 115
            }, {
                "brief": "服务于本地社区的数字社区",
                "endDate": 1422720027000,
                "groupId": 473,
                "groupIdType": 2,
                "groupName": "申邻里1",
                "id": 12,
                "isComfirmed": true,
                "isCurrent": false,
                "logo": "http://placehold.it/40x40/09f/fff",
                "position": 'FOUNDER',
                "positionDetail": "CTO",
                "startDate": 1406822400000,
                "uid": 115
            }]
        },
        "msg": "success"
    });
    $httpBackend.whenGET(/^\/api\/user\/\d+\/work/).respond(200, {
        code: 0,
        data: {
            expList: [{
                "brief": "上海乐奕创业投资中心（有限合伙）成立于2014年，是上海天奕达投资发展有限公司旗下的早期投资机构，主要进行早期的投资。",
                "endDate": 978192000000,
                "groupId": 472,
                "groupIdType": 2,
                "groupName": "上海乐奕创业投资中心（有限合伙）",
                "id": 25,
                "isConfirmed": false,
                "isCurrent": false,
                "isManager": false,
                "logo": "NULL",
                "position": "TECH",
                "positionDetail": "java程序员",
                "startDate": 946656001000,
                "uid": 1
            }, {
                "brief": "上海乐奕创业投资中心（有限合伙）成立于2014年，是上海天奕达投资发展有限公司旗下的早期投资机构，主要进行早期的投资。",
                "endDate": 978192000000,
                "groupId": 472,
                "groupIdType": 2,
                "groupName": "上海乐奕创业投资中心（有限合伙）",
                "id": 25,
                "isConfirmed": false,
                "isCurrent": false,
                "isManager": false,
                "logo": "NULL",
                "position": "TECH",
                "positionDetail": "java程序员",
                "startDate": 946656001000,
                "uid": 1
            }]
        },
        msg: "success"
    });

    $httpBackend.whenGET(/^\/api\/user\/\d+\/basic/).respond(200, {
        code: 0,
        data: {
            id: 1,
            avatar: 'http://placehold.it/40x40/09f/fff',
            name: '雷军',
            enterpriser: 0, // 是创业者?
            investorType: 10, // 是投资人?
            intro: 'IDG资本专注与中国市场有关的VC/PE投资项目，Xxxxx', // 机构简介
            followed: false, // 是否已关注，如果是本人请不要返回此字段
            linkedin: "p0po",
            weibo: "201268365",
            isDisplayWeixin: 0,
            weixin: 'http://weixin.com/matrix',
            weixin_code: 'http://placehold.it/40x40/09f/fff', // 微信二维码
            focusIntustry: ['E_COMMERCE', 'SOCIAL_NETWORK', 'ADVERTISING_MARKETING'],
            isInvestFirstPhase: 1,
            isInvestSecondPhase: 0,
            isInvestThirdPhase: 1,
            investMoneyBegin: '500',
            investMoneyEnd: '1000',
            investorType: 'USD', // USD, RMB
            orgMoneyBegin: '500',
            orgMoneyEnd: '1000',
            orgnization_single_type: 'USD', // USD, RMB
            city: 20108,
            country: 101,
            cteateTime: 1421916306000,
            schools: [{
                "id": 1,
                "name": "北京大学"
            }, {
                "id": 2,
                "name": "中国人民大学"
            }]
        }
    });

    $httpBackend.whenPOST(/^\/api\/user\/\d+\/followed/).respond(200, {
        code: 0,
        data: {
            followed: true
        }
    });



    $httpBackend.whenPOST(/^\/api\/user\/\d+\/basic/).respond(200, {
        code: 0,
        data: {
            ok: true
        }
    });

    $httpBackend.whenPUT(/^\/api\/user\/\d+\/basic/).respond(200, {
        code: 0,
        data: {
            ok: true
        }
    });

    $httpBackend.whenPOST(/^\/api\/user\/\d+\/investment/).respond(200, {
        code: 0,
        data: {
            ok: true
        }
    });

    $httpBackend.whenPOST(/^\/api\/user\/\d+\/finacing/).respond(200, {
        code: 0,
        data: {
            "cid": 1065,
            "createDate": 1423134699000,
            "deleteStatus": 1,
            "company":{
                id:12,
                name: "xxx",
                logo: ""
            },
            "details": [
                {
                    "cid": 1065,
                    "createDate": 1423134699000,
                    "deleteStatus": 1,
                    "entityId": 115,
                    "entityType": "INDIVIDUAL",
                    "financeEventId": 23,
                    "id": 23,
                    "investDate": 1393603200000,
                    "logo": "https://krplus.b0.upaiyun.com/201502/05172722/@拉依库兹出品 (7).jpg",
                    "name": "海南111",
                    "phase": "ANGEL",
                    "source": "ADMIN",
                    "status": "PENDING",
                    "updateDate": -62135798400000
                }
            ],
            "estimateValue": "asdf",
            "estimateValueUnit": "USD",
            "financeDate": 1393603200000,
            "financeValue": "asd",
            "financeValueUnit": "CNY",
            "id": 23,
            "isProcessed": 0,
            "isPublic": 1,
            "phase": "ANGEL",
            "source": "ADMIN",
            "status": "PENDING",
            "updateDate": -62135798400000
        }
    });
    $httpBackend.whenPUT(/^\/api\/user\/\d+\/finacing/).respond(200, {
        code: 0,
        data: {
            "cid": 1065,
            "createDate": 1423134699000,
            "deleteStatus": 1,
            "company":{
                id:12,
                name: "xxx",
                logo: ""
            },
            "details": [
                {
                    "cid": 1065,
                    "createDate": 1423134699000,
                    "deleteStatus": 1,
                    "entityId": 115,
                    "entityType": "INDIVIDUAL",
                    "financeEventId": 23,
                    "id": 23,
                    "investDate": 1393603200000,
                    "logo": "https://krplus.b0.upaiyun.com/201502/05172722/@拉依库兹出品 (7).jpg",
                    "name": "海南111",
                    "phase": "ANGEL",
                    "source": "ADMIN",
                    "status": "PENDING",
                    "updateDate": -62135798400000
                }
            ],
            "estimateValue": "asdf",
            "estimateValueUnit": "USD",
            "financeDate": 1393603200000,
            "financeValue": "asd",
            "financeValueUnit": "CNY",
            "id": 23,
            "isProcessed": 0,
            "isPublic": 1,
            "phase": "ANGEL",
            "source": "ADMIN",
            "status": "PENDING",
            "updateDate": -62135798400000
        }
    });
    $httpBackend.whenDELETE(/^\/api\/user\/\d+\/finacing/).respond(200, {
        code: 0,
        data: {
            id: 1
        }
    });
    // $httpBackend.whenPOST(/^\/api\/user\/\d+\/finance_sort/).respond(200, {
    //     code: 0,
    //     data: {
    //         ok: true
    //     }
    // });

    $httpBackend.whenPOST(/^\/api\/user\/\d+\/company/).respond(200, {
        code: 0,
        data: {
            id: 1
        }
    });
    $httpBackend.whenPUT(/^\/api\/user\/\d+\/company/).respond(200, {
        code: 0,
        data: {
            id: 1
        }
    });
    $httpBackend.whenDELETE(/^\/api\/user\/\d+\/company/).respond(200, {
        code: 0,
        data: {
            id: 1
        }
    });
    // $httpBackend.whenPOST(/^\/api\/user\/\d+\/company_sort/).respond(200, {
    //     code: 0,
    //     data: {
    //         ok: true
    //     }
    // });
    $httpBackend.whenPOST(/^\/api\/user\/\d+\/work/).respond(200, {
        code: 0,
        data: {
            id: 1
        }
    });
    $httpBackend.whenPUT(/^\/api\/user\/\d+\/work/).respond(200, {
        code: 0,
        data: {
            id: 1
        }
    });
    $httpBackend.whenDELETE(/^\/api\/user\/\d+\/work/).respond(200, {
        code: 0,
        data: {
            id: 1
        }
    });
    // $httpBackend.whenPOST(/^\/api\/user\/\d+\/work_sort/).respond(200, {
    //     code: 0,
    //     data: {
    //         ok: true
    //     }
    // });
});
