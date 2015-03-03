angular.module('defaultApp.mocks').run(function ($httpBackend) {

    // 获取正在融资的信息
    $httpBackend.whenGET(/^\/api\/company\/\d+\/funds/).respond(200, {
        "code": 0,
        "data": {
            //"bp": "bp url",
            //"cid": 1,
            //"competitor": "竞争对手这样的想法与孙这样的想法与孙这样的想法与孙",
            //"createDate": 1421573098622,
            //"dataLights": "到家美食会主打中高端餐饮品牌的外送服务，通过自建物流团队、到餐厅上门取餐并且派送至用户手中，来为原本不提供外卖服务的餐厅提供配送服务。这与饿了么、美团、百度外卖瞄准大街小巷的众多小餐馆策略不太一样。为什么选择与中高端餐厅合作？孙浩有自己的理由。首先，这是一个市场空白。外卖行业并不是有了互联网以后才出现的，丽华快餐就是典型的传统外卖提供商，只不过做的是“屌丝市场”。但是，中高端餐厅却一直不怎么做外送服务。所以，孙浩在看到了外卖 O2O 的机会后就果断切入了这个空白市场。",
            //"fundValue": "300~500 万",
            //"fundValueUnit": "CNY",
            //"id": 2,
            //"investValue": "2",
            //"investValueUnit": "CNY",
            //"phase": "ANGEL",
            //"privilage": 0,
            //"projectAdvantage": "这样的想法与孙浩在丽华快餐的经历有关。丽华快餐是当年全国最大的外卖提供商，从烹制到配送都是自己来完成，而孙浩在 2007 年加入丽华，担任职业经理人。孙浩在丽华几乎经历了所有的业务，经历了丽华的全盛时期，并在日单量 1 万多单的配送压力下对餐饮 B2C 配送的特点和难点有了切身的了解。离开丽华，也是孙浩看到了在工作餐之外，家庭用餐同样存在着巨大的需求。找到需求的下一步是想明白如何满足需求。",
            //"projectPlan": "这里的需求有两个层面，一个是用户的需求，另一个则是商家的需求。用户的需求无外乎是快速的送餐服务；而商家的需求是单量的增加，更是与之相匹配的运力的增强。其实，很多位于商务区的餐厅在用餐高峰阶段丝毫不缺订单，他们却的往往就是订单响应能力和配送能力。聚焦这两个层面的需求，自建物流便很自然的成为了孙浩的选择。",
            //"scale": "确实，从去年年中开始，餐饮 O2O 的热度迅速上升，尤其是外卖这个细分领域。饿了么，美团外卖，百度外卖、淘点点、易淘食，到家美食会等玩家共同把这一场角逐推向白热化。其中，饿了么与美团更是你追我赶，在单量、补贴、地推、融资等各方面步调几乎一致，让这场外卖 O2O 之战的硝烟味越变越浓。市场如同打了肾上腺素，越来越亢奋，那么大部分外卖 O2O 平台或主动、或跟随的都做出了“烧钱”的选择。",
            //"shares": "15%~20%",
            //"status": "RECOMMENDED",
            //"uid": 2,
            //"updateDate": 1421573098622
        },
        "msg": "success"
    });

    // 提交新一轮审核
    $httpBackend.whenPOST(/^\/api\/company\/\d+\/funds/).respond(200, {
        code: 0,
        data: {
            'id': 12
        }
    });

    // 修改投资人限制
    $httpBackend.whenPUT(/^\/api\/company\/\d+\/funds/).respond(200, {
        code: 0
    });

    // 获取过往投资方
    $httpBackend.whenGET(/^\/api\/company\/\d+\/investor/).respond(200, {
        "code":0,
        "data":{
            "data":[
                {
                    "brief":"一句话",
                    "createDate":1423102445846,
                    "entityId":1,
                    "entityType":"COMPANY",
                    "financeEventId":2,
                    "id":2,
                    "investDate":1423102445846,
                    "logo":"http://placehold.it/40x40/09f/fff",
                    "name":"36kr",
                    "phase":"A",
                    "source":"ADMIN",
                    "status":"CONFIRMED",
                    "updateDate":1423102445846
                }
            ],
            "limit":6,
            "offset":0,
            "page":1,
            "pageSize":6,
            "totalCount":1,
            "totalPages":1
        },
        "msg":"success"
    });

    // 添加过往投资方
    $httpBackend.whenPOST(/^\/api\/company\/\d+\/investor/).respond(200, {
        code: 0,
        data: {
            'id': 121
        }
    });

    // 删除过往投资方
    $httpBackend.whenDELETE(/^\/api\/company\/\d+\/investor\/\d/).respond(200, {
        code: 0
    });

    // 融资信息
    $httpBackend.whenGET(/^\/api\/company\/\d+\/finance/).respond(200, {
        "code":0,
        "data":{
            "data":[
                {
                    "cid":1,
                    "createDate":1423034590993,
                    "details":[
                        {
                            "brief":"一句话",
                            "createDate":1423034591055,
                            "entityId":1,
                            "entityType":"COMPANY",
                            "financeEventId":2,
                            "id":2,
                            "investDate":1423034591055,
                            "logo":"",
                            "name":"36kr",
                            "phase":"A",
                            "source":"ADMIN",
                            "status":"CONFIRMED",
                            "updateDate":1423034591055
                        }
                    ],
                    "estimateValue":"100L",
                    "estimateValueUnit":"CNY",
                    "financeDate":1423034590993,
                    "financeValue":"100L",
                    "financeValueUnit":"CNY",
                    "id":2,
                    "isProcessed":1,
                    "isPublic":1,
                    "phase":"A",
                    "status":"CONFIRMED",
                    "updateDate":1423034590993
                }
            ],
            "limit":4,
            "offset":0,
            "page":1,
            "pageSize":4,
            "totalCount":1,
            "totalPages":1
        },
        "msg":"success"
    });

    // 添加融资信息
    $httpBackend.whenPOST(/^\/api\/company\/\d+\/finance/).respond(200, {
        "code":0,
        "data":{
            id:121
        },
        "msg":"success"
    });

    // 编辑融资经历
    $httpBackend.whenPUT(/^\/api\/company\/\d+\/finance\/\d/).respond(200, {
        "code":0,
        "data":{
            "id":121
        },
        "msg":"success"
    });

    // 删除融资经历
    $httpBackend.whenDELETE(/^\/api\/company\/\d+\/finance\/\d/).respond(200, {
        code: 0
    });


    // 获取团队成员
    $httpBackend.whenGET(/^\/api\/company\/\d+\/employee/).respond(200, {
        code: 0,
        data: {
            "page": 1,
            "pageSize": 6,
            "totalCount": 15,
            "totalPages": 3,
            "data": [{
                "id": 3,
                "name": "Rio",
                "avatar": "http://placehold.it/40x40/09f/fff",
                "type": 1,
                "position": "CEO",
                "intro": "一句话简介的内容",
                "status": 1
            }, {
                "id": 12,
                "name": "Rio12",
                "avatar": "http://placehold.it/40x40/09f/fff",
                "type": 1,
                "position": "CEO",
                "intro": "一句话简介的内容",
                "status": 0
            }]
        }
    });

    // 添加团队成员
    $httpBackend.whenPOST(/^\/api\/company\/\d+\/employee/).respond(200, {
        code: 0,
        data: {
            "id": 12,
            "uid": 22,
            "name": "xxx",
            "avatar": "xxxx",
            "level": "xxx",
            "position": "xxxx"
        }
    });

    // 删除团队成员
    $httpBackend.whenDELETE(/^\/api\/company\/\d+\/employee\/\d/).respond(200, {
        code: 0
    });


    // 获取创始成员
    $httpBackend.whenGET(/^\/api\/company\/\d+\/founder/).respond(200, {
        code: 0,
        data: {
            "page": 1,
            "pageSize": 6,
            "totalCount": 15,
            "totalPages": 3,
            "data": [{
                "id": 3,
                "name": "Rio",
                "avatar": "http://placehold.it/80x80/09f/fff",
                "type": 1,
                "position": "CEO",
                "intro": "一句话简介的内容",
                "status": 1
            }, {
                "id": 12,
                "name": "Rio12",
                "avatar": "http://placehold.it/80x80/09f/fff",
                "type": 1,
                "position": "CEO",
                "intro": "一句话简介的内容",
                "status": 0
            }]
        }
    });

    // 添加创始成员
    $httpBackend.whenPOST(/^\/api\/company\/\d+\/founder/).respond(200, {
        code: 0,
        data: {
            "id": 12,
            "uid": 22,
            "name": "xxx",
            "avatar": "http://placehold.it/80x80/09f/fff",
            "brief": "一句话简介的内容"
        }
    });

    // 删除创始团队成员
    $httpBackend.whenDELETE(/^\/api\/company\/\d+\/founder\/\d/).respond(200, {
        code: 0
    });


    // 获取子产品
    $httpBackend.whenGET(/^\/api\/company\/\d+\/product/).respond(200, {
        code: 0,
        data: {
            "page": 1,
            "pageSize": 6,
            "totalCount": 15,
            "totalPages": 3,
            "data": [{
                "id": 3,
                "name": "next",
                "website": "http://next.36kr.com/1",
                "nextLink": "http://next.36kr.com/1"
            }, {
                "id": 4,
                "name": "kr-plus",
                "website": "http://next.36kr.com/12",
                "nextLink": "http://next.36kr.com/1"
            }]
        }
    });

    // 编辑子产品
    $httpBackend.whenPUT(/^\/api\/company\/\d+\/product\/\d/).respond(200, {
        code: 0
    });

    // 添加子产品
    $httpBackend.whenPOST(/^\/api\/company\/\d+\/product/).respond(200, {
        code: 0,
        data: {
            'id': 10
        }
    });

    // 删除子产品
    $httpBackend.whenDELETE(/^\/api\/company\/\d+\/product\/\d/).respond(200, {
        code: 0
    });


    // 获取公司信息
    $httpBackend.whenGET(/^\/api\/company\/\d+/).respond(200, {
        code: 0,
        data: {
            "basic": {
                "name": "36氪",
                "fullName": "北京齐心筑成信息技术有限公司",
                "brief": "专注于互联网创业",
                "logo": "",
                "industry": "MEDIA",
                "status": "CREATED",
                "manager": 100,
                "operationStatus": "CLOSED",
                "address1": 103,
                "address2": 20301,
                "address3": 3030101,
                "startDate": 1388505600000,
                "website": "http://www.36kr.com",
                "weibo": "http://www.weibo.com/36kr",
                "weixin": "weixin"
            },
            "other": {
                "webLink": "http://www.36kr.com/web",
                "pcLink": "http://www.36kr.com/pc",
                "androidLink": "http://www.36kr.com/android",
                "ipadAppstoreLink": "http://www.36kr.com/ipad",
                "iphoneAppstoreLink": "http://www.36kr.com/iphone",
                "pictures": "http://placehold.it/150x90/09f/fff,http://placehold.it/150x90/03f/fff",
                "intro": "2010年12月8日，36氪作为科技媒体正式上线，其名字源于元素周期表的第36号元素“氪”，化学符号为Kr一个稳定、独立，不易与其他其他物质发生化学作用的元素。传说中的氪星是超人的故乡。 经历四年成长，36氪不仅有备受顶级投资 机构关注的高效互联网融资平台（氪加），还有专注于互联网创业项目孵化的氪空间（Kr Space），在全中国首创了“不收费、不占股、全球资本，平台服务”的新型孵化器模式。同时，36氪的科技媒体，已然成为最前沿科技资讯的平台，也是互联网创业者寻求报道，接洽资本的首选入口。由媒体、氪加和氪空间三条产品线，构成了36氪专注互联网创业的生态圈模式。   创始人兼CEO刘成城（Liu CC），1988年出生在江苏盐城。中国科学院硕士，在2013年被《福布斯》评为“中国30岁以下的创业者前30名”之一 。 36氪从4个创始人到现在100人，90%的员工都是85后，平均年龄25岁，我们更了解年轻人，我们更了解创业者，我们更了解创投的生态环境。年轻开放的团队，从早午餐到下午茶，从每周健康按摩到集体出境旅行，让每位员工的付出与福利同步前进。    氪加是36氪从创业观察者到践行者的升级，从媒体到平台到延伸36氪不仅有备受顶级投资机构关注的高效互联网融资平台（氪加），还有专注于互联网创业项目孵化的氪空间（Kr Space），在全中国首创了“不收费…  ",
                "story": "2010年12月8日，36氪作为科技媒体正式上线，其名字源于元素周期表的第36号元素“氪”，化学符号为Kr一个稳定、独立，不易与其他其他物质发生化学作用的元素。传说中的氪星是超人的故乡。 经历四年成长，36氪不仅有备受顶级投资 机构关注的高效互联网融资平台（氪加），还有专注于互联网创业项目孵化的氪空间（Kr Space），在全中国首创了“不收费、不占股、全球资本，平台服务”的新型孵化器模式。同时，36氪的科技媒体，已然成为最前沿科技资讯的平台，也是互联网创业者寻求报道，接洽资本的首选入口。由媒体、氪加和氪空间三条产品线，构成了36氪专注互联网创业的生态圈模式。   创始人兼CEO刘成城（Liu CC），1988年出生在江苏盐城。中国科学院硕士，在2013年被《福布斯》评为“中国30岁以下的创业者前30名”之一 。 36氪从4个创始人到现在100人，90%的员工都是85后，平均年龄25岁，我们更了解年轻人，我们更了解创业者，我们更了解创投的生态环境。年轻开放的团队，从早午餐到下午茶，从每周健"
            },
            "funds": {
                "fundsId": 0,
                "privilege": "INVESTOR",
                "value": "100",
                "unit": "USD",
                "phase": "A",
                "status": 1
            },
            "tags": [
                {
                    "id": 12,
                    "name": "IM"
                },
                {
                    "id": 13,
                    "name": "IM"
                }
            ],
            // 'manager': 'guoquan',
            "editable": true
        }
    });

// 更新公司信息
    $httpBackend.whenPUT(/^\/api\/company\/\d/).respond(200, {
        code: 0
    });

    //公司列表接口
    //TODO:这块与实际数据格式不一致
    $httpBackend.whenGET(function (url) {
        if (url.indexOf('/api/company') > -1) {
            if (url.indexOf('action=') > -1) {
                return false;
            }
            return true
        }
        return false;
    }).respond(200, {
        code: 0,
        data: {
            "page": {
                "data": [{
                    "company": {
                        'isfinaceStatus': 0,
                        "address2": 2,
                        "brief": "一句话简介，美女集中营",
                        "financePhase": 3,
                        "id": 1,
                        "industry": "大法师打发士大夫",
                        "logo": "http://d.hiphotos.baidu.com/image/pic/item/b21bb051f81986189d6f84ff49ed2e738bd4e6a5.jpg",
                        "name": "测试公司0",
                        'recomment': 0
                    },
                    "investor": [
                        "红杉",
                        "小米",
                        "百度"
                    ],
                    "user": [{
                        "id": 1,
                        "name": "dasdfsda"
                    }, {
                        "id": 2,
                        "name": "dasdfsda"
                    }, {
                        "id": 3,
                        "name": "dasdfsda"
                    }]
                }, {
                    "company": {
                        "isfinaceStatus": 0,
                        "address2": 2,
                        "brief": "一句话简介，美女集中营",
                        "financePhase": 3,
                        "id": 1,
                        "industry": "大法师打发士大夫",
                        "logo": "http://d.hiphotos.baidu.com/image/pic/item/b21bb051f81986189d6f84ff49ed2e738bd4e6a5.jpg",
                        "name": "测试公司1",
                        'recomment': 1
                    },
                    "investor": [
                        "红杉",
                        "小米",
                        "百度"
                    ],
                    "user": [{
                        "id": 1,
                        "name": "dasdfsda"
                    }, {
                        "id": 2,
                        "name": "dasdfsda"
                    }, {
                        "id": 3,
                        "name": "dasdfsda"
                    }]
                }, {
                    "company": {
                        "isfinaceStatus": 1,
                        "address2": 2,
                        "brief": "一句话简介，美女集中营1",
                        "financePhase": 3,
                        "id": 1,
                        "industry": "大法师打发士大夫",
                        "logo": "http://d.hiphotos.baidu.com/image/pic/item/b21bb051f81986189d6f84ff49ed2e738bd4e6a5.jpg",
                        "name": "测试公司2",
                        'recomment': 0
                    },
                    "investor": [
                        "红杉",
                        "小米",
                        "百度"
                    ],
                    "user": [{
                        "id": 1,
                        "name": "dasdfsda"
                    }, {
                        "id": 2,
                        "name": "dasdfsda"
                    }, {
                        "id": 3,
                        "name": "dasdfsda"
                    }]
                }, {
                    "company": {
                        "isfinaceStatus": 2,
                        "address2": 2,
                        "brief": "一句话简介，美女集中营2",
                        "financePhase": 3,
                        "id": 1,
                        "industry": "大法师打发士大夫",
                        "logo": "http://d.hiphotos.baidu.com/image/pic/item/b21bb051f81986189d6f84ff49ed2e738bd4e6a5.jpg",
                        "name": "测试公司3",
                        'recomment': 1
                    },
                    "investor": [
                        "红杉",
                        "小米",
                        "百度"
                    ],
                    "user": [{
                        "id": 1,
                        "name": "dasdfsda"
                    }, {
                        "id": 2,
                        "name": "dasdfsda"
                    }, {
                        "id": 3,
                        "name": "dasdfsda"
                    }]
                }],
                "limit": 4,
                "offset": 8,
                "page": 3,
                "pageSize": 4,
                "totalCount": 12345,
                "totalPages": 37,
                'finacingCount': 400,
                'financeCompletedCount': 5000
            }
        }
    });

    //创建公司接口
    $httpBackend.whenPOST('/api/company').respond(200, {
        code: 0,
        data: {
            id: 12
        }
    });
    //检查公司url接口
    $httpBackend.whenGET(function (url) {
        if (url.indexOf('/api/company') > -1 && url.indexOf('action=check') > -1) {
            return true;
        }
        return false
    }).respond(200, {
        code: 2
    });


    // 提交审核
    $httpBackend.whenPOST(/^\/api\/company\/\d+\/audit/).respond(200, {
        code: 0
    });


    // 更改公司信息
    $httpBackend.whenPUT(/^\/api\/company\/\d+\/basic/).respond(200, {
        code: 0
    });


    // 保存公司链接
    $httpBackend.whenPUT(/^\/api\/company\/\d+\/link/).respond(200, {
        code: 0
    });


    // 保存公司介绍
    $httpBackend.whenPUT(/^\/api\/company\/\d+\/intro/).respond(200, {
        code: 0
    });


});



















