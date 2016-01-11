angular.module('defaultApp.mocks').run(function ($httpBackend) {
    // 添加机构
    $httpBackend.whenPOST(/^\/api\/organization/).respond(200, {
        code: 0,
        data: {
            'id': 12
        }
    });

    //顶级机构
    $httpBackend.whenGET(/^\/api\/organization\/top/).respond(200, {
        "code": 0,
        "data": {
            "data": [{
                "id": 0,
                "investCom": [{
                    "androidLink": "",
                    "brief": "服务共享中心，为用户提供金融后台数据外包服务",
                    "createDate": 1421824920000,
                    "financeEventId": 0,
                    "financePhase": "NONE",
                    "fullName": "渣打(中国)科技营运有限公司",
                    "fundId": 0,
                    "id": 561,
                    "industry": "MEDICAL_HEALTH",
                    "intro": "",
                    "ipadAppstoreLink": "",
                    "iphoneAppstoreLink": "",
                    "isDeleted": false,
                    "isStartup": true,
                    "logo": "http://img.36tr.com/logo/2014114/o_195sdp5ka2601nan16l2vme69ck?imageView/1/w/180/h/180",
                    "managerId": 1,
                    "name": "渣打科技",
                    "operationStatus": "OPEN",
                    "pcLink": "",
                    "pictures": "",
                    "startDate": 1174492800000,
                    "status": "CREATED",
                    "story": "",
                    "updateDate": 1421906987000,
                    "webLink": "",
                    "website": "www.scopeinternational.cn",
                    "weibo": "",
                    "weixin": ""
                }, {
                    "androidLink": "",
                    "brief": "综合性设计网站,为设计师提供互动交流平台",
                    "createDate": 1421824920000,
                    "financeEventId": 0,
                    "financePhase": "NONE",
                    "fullName": "北京站酷网络科技有限公司",
                    "fundId": 0,
                    "id": 578,
                    "industry": "MEDICAL_HEALTH",
                    "intro": "",
                    "ipadAppstoreLink": "",
                    "iphoneAppstoreLink": "",
                    "isDeleted": false,
                    "isStartup": true,
                    "logo": "http://img.36tr.com/logo/2014114/o_195sdp5ka2601nan16l2vme69ck?imageView/1/w/180/h/180",
                    "managerId": 1,
                    "name": "站酷",
                    "operationStatus": "OPEN",
                    "pcLink": "",
                    "pictures": "",
                    "startDate": 1270742400000,
                    "status": "CREATED",
                    "story": "",
                    "updateDate": 1421906987000,
                    "webLink": "",
                    "website": "www.zcool.com.cn",
                    "weibo": "http://weibo.com/hizcool",
                    "weixin": "海洛创意;站酷招聘;主创网;站酷商店"
                }],
                "investComCount": 2,
                "member": [{
                    "avatar": "https://krplus.b0.upaiyun.com/201502/05172722/@拉依库兹出品 (7).jpg",
                    "city": 20310,
                    "country": 103,
                    "cteateTime": 1422953794000,
                    "email": "",
                    "enterpriser": 1,
                    "id": 115,
                    "intro": "36kr 开发工程师111",
                    "investMoneyBegin": "20",
                    "investMoneyEnd": "40",
                    "investMoneyUnit": 2,
                    "investorType": 20,
                    "isDisplayWeixin": 1,
                    "isInvestFirstPhase": 1,
                    "isInvestSecondPhase": 0,
                    "isInvestThirdPhase": 0,
                    "linkedin": "http://www.link.com111",
                    "name": "海南111",
                    "orgMoneyBegin": "19",
                    "orgMoneyEnd": "100",
                    "orgMoneyUnit": 1,
                    "phone": "",
                    "status": 0,
                    "updateTime": 1422953794000,
                    "weibo": "http://weibo.com/1112610160232/profile",
                    "weixin": "122707427"
                }],
                "memberCount": 1,
                "organization": {
                    "city": 101,
                    "enName": "Beijing Unity Yunqi Investment Center (L.P.)",
                    "enNameAbbr": "Unity Ventures",
                    "id": 36,
                    "intro": "北京九合云起投资中心（有限合伙）成立于2011年，是一家由王啸（百度创始团队之一）创立的，专注于早期互联网/移动互联网创业公司的天使投资机构。",
                    "logo": "",
                    "manageCapitalCn": "",
                    "name": "北京九合云起投资中心（有限合伙）",
                    "nameAbbr": "九合创投",
                    "startDate": -62135798400000,
                    "status": 2,
                    "type": 2,
                    "website": "www.unityvc.com",
                    "weibo": ""
                }
            }, {
                "id": 0,
                "investCom": [],
                "investComCount": 0,
                "member": [],
                "memberCount": 0,
                "organization": {
                    "city": 3050911,
                    "enName": "Shanghai Zhongke Angsen Venture Capital Co., Ltd.",
                    "enNameAbbr": "Zhongke Angsen VC",
                    "id": 38,
                    "intro": "上海中科昂森创业投资有限公司成立于2011年，注册资本为1亿元，于2012年在上海发改委会完成备案，主要从事创业投资业务。",
                    "logo": "NULL",
                    "manageCapitalCn": "100000",
                    "manageCapitalUs": "99777",
                    "maxInvestAbilityCn": "434",
                    "maxInvestAbilityUs": "3231",
                    "minInvestAbilityCn": "24",
                    "minInvestAbilityUs": "33",
                    "name": "上海中科昂森创业投资有限公司",
                    "nameAbbr": "中科昂森创投",
                    "startDate": 1422353382000,
                    "status": 2,
                    "type": 2,
                    "website": "",
                    "weibo": ""
                }
            }]
        },
        "msg": "success"
    });

    //投资人列表
    $httpBackend.whenGET(/^\/api\/organization\/investor/).respond(200, {
        "code": 0,
        "data": {
            "data": [
                {
                    "id": 0,
                    "investCom": [
                        {
                            "brief": "这是一个测试公司，将来会替换为正式公司",
                            "id": 1,
                            "name": "测试公司1"
                        },
                        {
                            "brief": "这是一个测试公司，将来会替换为正式公司",
                            "id": 2,
                            "name": "测试公司2"
                        }
                    ],
                    "user": {
                        "city": 101,
                        "country": 10,
                        "cteateTime": 1422710631000,
                        "enterpriser": 0,
                        "id": 1,
                        "intro": "测试账号",
                        "investMoneyBegin": 45234523,
                        "investMoneyEnd": 213123,
                        "investorType": 10,
                        "isDisplayWeixin": 0,
                        "isInvestFirstPhase": 0,
                        "isInvestSecondPhase": 0,
                        "isInvestThirdPhase": 0,
                        "name": "永坡",
                        "investorFollowedIndustry": ['E_COMMERCE', 'INTELLIGENT_HARDWARE'],
                        "orgMoneyBegin": 1213,
                        "orgMoneyEnd": 123123,
                        "phone": "18601053231",
                        "updateTime": 1422710631000,
                        "weibo": "201268365"
                    }
                },
                {
                    "id": 0,
                    "investCom": [
                        {
                            "brief": "这是一个测试公司，将来会替换为正式公司",
                            "id": 1,
                            "name": "测试公司1"
                        },
                        {
                            "brief": "这是一个测试公司，将来会替换为正式公司",
                            "id": 2,
                            "name": "测试公司2"
                        }
                    ],
                    "user": {
                        "city": 101,
                        "country": 10,
                        "cteateTime": 1422774009000,
                        "enterpriser": 0,
                        "id": 106,
                        "intro": "测试第三方登录用",
                        "investMoneyBegin": 45234523,
                        "investMoneyEnd": 45234523,
                        "investMoneyUnit": "USD",
                        "investorType": 10,
                        "isDisplayWeixin": 0,
                        "isInvestFirstPhase": 0,
                        "isInvestSecondPhase": 0,
                        "isInvestThirdPhase": 0,
                        "linkedin": "",
                        "name": "22",
                        "investorFollowedIndustry": ['E_COMMERCE', 'INTELLIGENT_HARDWARE'],
                        "investCount": 10,
                        "orgMoneyBegin": 12312312,
                        "orgMoneyEnd": 134314,
                        "orgMoneyUnit": "USD",
                        "updateTime": 1422844540000,
                        "weibo": "201268123"
                    }
                },
                {
                    "id": 0,
                    "investCom": [
                        {
                            "brief": "这是一个测试公司，将来会替换为正式公司",
                            "id": 1,
                            "name": "测试公司1"
                        },
                        {
                            "brief": "这是一个测试公司，将来会替换为正式公司",
                            "id": 2,
                            "name": "测试公司2"
                        }
                    ],
                    "user": {
                        "cteateTime": 1422787179000,
                        "enterpriser": 0,
                        "id": 107,
                        "investMoneyBegin": 0,
                        "investMoneyEnd": 0,
                        "investorType": 20,
                        "isDisplayWeixin": 0,
                        "isInvestFirstPhase": 0,
                        "isInvestSecondPhase": 0,
                        "isInvestThirdPhase": 0,
                        "orgMoneyBegin": 0,
                        "orgMoneyEnd": 0,
                        "investorFollowedIndustry": ['E_COMMERCE', 'INTELLIGENT_HARDWARE'],
                        "updateTime": 1422787179000
                    }
                },
                {
                    "id": 0,
                    "investCom": [
                        {
                            "brief": "这是一个测试公司，将来会替换为正式公司",
                            "id": 1,
                            "name": "测试公司1"
                        },
                        {
                            "brief": "这是一个测试公司，将来会替换为正式公司",
                            "id": 2,
                            "name": "测试公司2"
                        }
                    ],
                    "user": {
                        "avatar": "http://wx.qlogo.cn/mmopen/ajNVdqHZLLB7AG7iblcDV3dPxHWG9GsCX1cNPoo3JvZAj8petd7n21Vsw37jZQOMibCiactHEDD1ZvJicCibWZPBMsw/0",
                        "cteateTime": 1422787421000,
                        "enterpriser": 0,
                        "id": 108,
                        "investMoneyBegin": 0,
                        "investMoneyEnd": 0,
                        "investorType": 10,
                        "isDisplayWeixin": 0,
                        "isInvestFirstPhase": 0,
                        "isInvestSecondPhase": 0,
                        "isInvestThirdPhase": 0,
                        "orgMoneyBegin": 0,
                        "orgMoneyEnd": 0,
                        "investorFollowedIndustry": ['E_COMMERCE', 'INTELLIGENT_HARDWARE'],
                        "investCount": 10,
                        "phone": "18601053231",
                        "updateTime": 1422847874000
                    }
                },
                {
                    "id": 0,
                    "investCom": [
                        {
                            "brief": "这是一个测试公司，将来会替换为正式公司",
                            "id": 1,
                            "name": "测试公司1"
                        },
                        {
                            "brief": "这是一个测试公司，将来会替换为正式公司",
                            "id": 2,
                            "name": "测试公司2"
                        }
                    ],
                    "user": {
                        "avatar": "http://wx.qlogo.cn/mmopen/ajNVdqHZLLB7AG7iblcDV3dPxHWG9GsCX1cNPoo3JvZAj8petd7n21Vsw37jZQOMibCiactHEDD1ZvJicCibWZPBMsw/0",
                        "cteateTime": 1422848086000,
                        "enterpriser": 0,
                        "id": 109,
                        "investMoneyBegin": 0,
                        "investMoneyEnd": 0,
                        "investorType": 10,
                        "isDisplayWeixin": 0,
                        "isInvestFirstPhase": 0,
                        "isInvestSecondPhase": 0,
                        "isInvestThirdPhase": 0,
                        "orgMoneyBegin": 0,
                        "investorFollowedIndustry": ['E_COMMERCE', 'INTELLIGENT_HARDWARE'],
                        "orgMoneyEnd": 0,
                        "updateTime": 1422848908000
                    }
                },
                {
                    "id": 0,
                    "investCom": [
                        {
                            "brief": "这是一个测试公司，将来会替换为正式公司",
                            "id": 1,
                            "name": "测试公司1"
                        },
                        {
                            "brief": "这是一个测试公司，将来会替换为正式公司",
                            "id": 2,
                            "name": "测试公司2"
                        }
                    ],
                    "user": {
                        "cteateTime": 1422865288000,
                        "enterpriser": 0,
                        "id": 110,
                        "investMoneyBegin": 0,
                        "investMoneyEnd": 0,
                        "investorType": 20,
                        "isDisplayWeixin": 0,
                        "isInvestFirstPhase": 0,
                        "isInvestSecondPhase": 0,
                        "isInvestThirdPhase": 0,
                        "orgMoneyBegin": 0,
                        "orgMoneyEnd": 0,
                        "updateTime": 1422937623000
                    }
                },
                {
                    "id": 0,
                    "investCom": [
                        {
                            "brief": "这是一个测试公司，将来会替换为正式公司",
                            "id": 1,
                            "name": "测试公司1"
                        },
                        {
                            "brief": "这是一个测试公司，将来会替换为正式公司",
                            "id": 2,
                            "name": "测试公司2"
                        }
                    ],
                    "user": {
                        "avatar": "http://wx.qlogo.cn/mmopen/Asz6zle1CoTHyv5ut7y9iajgDpgmcSyibLLzibG5nAdZ5hHAibPH9dIQJne54lBz9pwYzpe0yovqLHD146XLDEyprw/0",
                        "cteateTime": 1422865333000,
                        "enterpriser": 0,
                        "id": 111,
                        "investMoneyBegin": 0,
                        "investMoneyEnd": 0,
                        "investorType": 20,
                        "isDisplayWeixin": 0,
                        "isInvestFirstPhase": 0,
                        "isInvestSecondPhase": 0,
                        "isInvestThirdPhase": 0,
                        "orgMoneyBegin": 0,
                        "orgMoneyEnd": 0,
                        "updateTime": 1422937952000
                    }
                }
            ],
            "limit": 12,
            "offset": 0,
            "page": 1,
            "pageSize": 12,
            "totalCount": 700,
            "totalPages": 1
        },
        "msg": "success"
    });


    // 机构背景
    $httpBackend.whenGET(/^\/api\/organization\/\d+\/background/).respond(200, {
        code: 0,
        data: {
            'content': 'xxxxx'
        }
    });

    // 机构基本信息
    $httpBackend.whenGET(/^\/api\/organization\/\d+\/basic/).respond(200, {
        "code": 0,
        "data": {
            "enName": "Beijing Unity Yunqi Investment Center (L.P.)",
            "enNameAbbr": "Unity Ventures",
            "id": 36,
            "intro": "北京九合云起投资中心（有限合伙）成立于2011年北京九合云起投资中心（有限合伙）成立于2011年北京九合云起投资中心（有限合伙）成立于2011年北京九合云起投资中心（有限合伙）成立于2011年北京九合云起投资中心（有限合伙）成立于2011年北京九合云起投资中心（有限合伙）成立于2011年北京九合云起投资中心（有限合伙）成立于2011年北京九合云起投资中心（有限合伙）成立于2011年北京九合云起投资中心（有限合伙）成立于2011年北京九合云起投资中心（有限合伙）成立于2011年北京九合云起投资中心（有限合伙）成立于2011年北京九合云起投资中心（有限合伙）成立于2011年北京九合云起投资中心（有限合伙）成立于2011年北京九合云起投资中心（有限合伙）成立于2011年，是一家由王啸（百度创始团队之一）创立的，专注于早期互联网/移动互联网创业公司的天使投资机构。",
            "logo": "NULL",
            "name": "北京九合云起投资中心（有限合伙）",
            "nameAbbr": "九合创投",
            "startTime": 1312992000000,
            "type": 0,
            "website": "www.unityvc.com",
            "weibo": ""
        },
        "msg": "success"
    });

    // 机构联系地址
    $httpBackend.whenGET(/^\/api\/organization\/\d+\/addr/).respond(200, {
        "code": 0,
        "data": {
            "addr": [
                {
                    "address": "北京市",
                    "city": 101,
                    "createTime": 1422262491000,
                    "email": "wangyongpo@36kr.com",
                    "id": 1,
                    "orgId": 36,
                    "phone": "18601053231",
                    "tax": "010-66688822",
                    "updateTime": 1422262491000
                }
            ],
            "org": {
                "enName": "Beijing Unity Yunqi Investment Center (L.P.)",
                "enNameAbbr": "Unity Ventures",
                "id": 36,
                "intro": "北京九合云起投资中心（有限合伙）成立于2011年，是一家由王啸（百度创始团队之一）创立的，专注于早期互联网/移动互联网创业公司的天使投资机构。",
                "logo": "NULL",
                "name": "北京九合云起投资中心（有限合伙）",
                "nameAbbr": "九合创投",
                "startTime": 1312992000000,
                "type": 2,
                "website": "www.unityvc.com",
                "weibo": ""
            }
        },
        "msg": "success"
    });

    // 投资案例
    $httpBackend.whenGET(/^\/api\/organization\/\d+\/finance/).respond(200, {
        code: 0,
        data: {
            "data": [{
                "id": 111,
                "phase": "????",
                "invest_value": "1000万",
                "estimate_value": "12亿",
                "???单位（美元）": "????",
                "is_public": 1,
                "invest_date": "????",
                "company": {
                    "id": 12,
                    "logo": "http://xxx.xx/xx.png",
                    "name": "xxxx",
                    "brief": "xxxxx"
                }
            }, {
                "id": 2222,
                "phase": "????",
                "invest_value": "1000万",
                "estimate_value": "12亿",
                "???单位（美元）": "????",
                "is_public": 1,
                "invest_date": "????",
                "company": {
                    "id": 12,
                    "logo": "http://xxx.xx/xx.png",
                    "name": "xxxx",
                    "brief": "xxxxx"
                }
            }, {
                "id": 333,
                "phase": "????",
                "invest_value": "1000万",
                "estimate_value": "12亿",
                "???单位（美元）": "????",
                "is_public": 1,
                "invest_date": "????",
                "company": {
                    "id": 12,
                    "logo": "http://xxx.xx/xx.png",
                    "name": "xxxx",
                    "brief": "xxxxx"
                }
            }]
        }
    });

    // 机构成员
    $httpBackend.whenGET(/^\/api\/organization\/\d+\/user/).respond(200, {
        code: 0,
        data: {
            "data": [
                {
                    "city": 101,
                    "country": 22,
                    "cteateTime": 1421916306000,
                    "enterpriser": 0,
                    "id": 1,
                    "intro": "这是一个测试账户",
                    "investMoneyBegin": 0,
                    "investMoneyEnd": 0,
                    "investorType": 0,
                    "isDisplayWeixin": 0,
                    "isInvestFirstPhase": 0,
                    "isInvestSecondPhase": 0,
                    "isInvestThirdPhase": 0,
                    "linkedin": "p0po",
                    "orgMoneyBegin": 0,
                    "orgMoneyEnd": 0,
                    "phone": "18601053231",
                    "updateTime": 1422239481000,
                    "weibo": "201268365"
                }
            ],
        },
        "msg": "success"
    });

});
