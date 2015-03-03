angular.module('defaultApp.mocks').run(function ($httpBackend) {

    console.log('other');

    // 我的消息
    $httpBackend.whenGET(/\/inmail\/\d+$/).respond(200, {
        "code": 0,
        "data": {
            "data": [{
                "content": "1",
                "createDate": 1421753127000,
                "direction": 1,
                "fromUid": 11,
                "id": 1,
                "isRead": 1,
                "status": 0,
                "toUid": 1,
                "updateDate": 1421753127000
            }, {
                "content": "1",
                "createDate": 1421753127000,
                "direction": 1,
                "fromUid": 22,
                "id": 1,
                "isRead": 1,
                "status": 0,
                "toUid": 1,
                "updateDate": 1421753127000
            }],
            "limit": 500,
            "offset": 0,
            "page": 1,
            "pageSize": 500,
            "totalCount": 1,
            "totalPages": 1,
            "fromUser": {
                "cteateTime": 1421663975000,
                "id": 11,
                "intro": "eeeee",
                "investorType": 2,
                "name": "testMe",
                "updateTime": 1421392211000,
                "avatar": "http://placehold.it/50x50/09f/fff"
            },
            "toUser": {
                "cteateTime": 1421663975000,
                "id": 22,
                "intro": "eeeee",
                "investorType": 2,
                "name": "testTo",
                "updateTime": 1421392211000,
                "avatar": "http://placehold.it/50x50/09f/fff"
            },
            "isFollowed": true
        },
        "msg": "success"
    });

    // 我的消息
    $httpBackend.whenGET(/\/inmail$/).respond(200, {
        "code": 0,
        "data": {
            "data": [
                {
                    "content": "1",
                    "createDate": 1420715948000,
                    "direction": 1,
                    "fromUid": 1,
                    "id": 1,
                    "toUid": 1
                }
            ],
            "limit": 500,
            "offset": 0,
            "page": 1,
            "pageSize": 500,
            "totalCount": 3,
            "totalPages": 1,
            "userMap": {
                "1": {
                    "cteateTime": 1421663975000,
                    "id": 1,
                    "intro": "eeeee",
                    "investorType": 2,
                    "name": "test",
                    "updateTime": 1421392211000
                }
            },
            "unReadCntMap": {
                "1": 1
            }
        },
        "msg": "success"
    });

    // 消息数
    // $httpBackend.whenGET(function(url){
    //  if(url.inddexOf('/inmail')> -1 && url.inddexOf('action=')> -1){
    //      return true;
    //  }
    //  return false;
    // }).respond(200,{
    //  code: 0,
    //  data: {
    //      'count': 10
    //  }
    // });
    $httpBackend.whenGET(/^\/inmail\?action=/).respond(200, {
        code: 0,
        data: {
            'count': 10
        }
    });

    // 我的消息
    $httpBackend.whenGET(/\/inmail\?.*type=/).respond(200, {
        "code": 0,
        "data": {
            "data": [
                {
                    "content": "1",
                    "createDate": 1420715948000,
                    "direction": 1,
                    "fromUid": 1,
                    "id": 1,
                    "toUid": 1
                }
            ],
            "limit": 500,
            "offset": 0,
            "page": 1,
            "pageSize": 500,
            "totalCount": 3,
            "totalPages": 1,
            "userMap": {
                "1": {
                    "cteateTime": 1421663975000,
                    "id": 1,
                    "intro": "eeeee",
                    "investorType": 2,
                    "name": "test",
                    "updateTime": 1421392211000,
                    "avatar": 'http://placehold.it/40x40/09f/fff'
                }
            },
            "unReadCntMap": {
                "1": 0
            }
        },
        "msg": "success"
    });

    // 与好友单独聊天
    $httpBackend.whenGET(/^\/inmail\/\d/).respond(200, {
        code: 0,
        data: {
            "to_user": {
                "id": 121,
                "avatar": "http://placehold.it/40x40/09f/fff",
                "name": "xxxx",
                "brief": "xxxxx"
            },
            "from_user": {
                "id": 122,
                "avatar": "http://placehold.it/40x40/09f/fff",
                "name": "xxxx"
            },
            "count": 1000,
            "total_pages": 12,
            "current_page": 1,
            "data": [{
                "id": 11,
                "to_uid": 121,
                "content": "xxxx",
                "update_date": "????"
            }, {
                "id": 12,
                "to_uid": 122,
                "content": "xxxx",
                "update_date": "????"
            }]
        }
    });

    // 与好友单独聊天（发送消息）
    $httpBackend.whenPOST(/\/inmail\/\d/).respond(200, {
        code: 0,
        data: {
            'id': 12
        }
    });

    // 与好友单独聊天（删除我的消息）
    $httpBackend.whenDELETE(/^\/inmail\/\d+\/\d/).respond(200, {
        code: 0
    });

    // 我创建（管理）的公司
    $httpBackend.whenGET(/^\/my\/company/).respond(200, {
        code: 0,
        data: {
            "data": [{
                "id": 12,
                "logo": "http://placehold.it/40x40/09f/fff",
                "name": "36kr",
                "status": 0
            }]
        }
    });




    // 系统消息
    $httpBackend.whenGET(/\/notification/).respond(200, {
        "code": 0,
        "data": {
            "data": [{
                "content": "<div class=\"notification-content\"><div class=\"content\">test</div></div>",
                "createDate": 1421844579000,
                "id": 13
            }, {
                "content": "<div class=\"notification-content\"><div class=\"content\">test</div></div>",
                "createDate": 1421727042000,
                "id": 12
            }, {
                "content": "<div class=\"notification-content\"><div class=\"content\">test</div></div>",
                "createDate": 1421657093000,
                "id": 11
            }, {
                "content": "<div class=\"notification-content\">\n    <div class=\"content\">\n    test已添加你为<a href=\"#\">happy</a>Pre-A轮\n        的投资⼈人,这个信息对我⼗十分重要,请点击确认:\n    </div>\n    <div class=\"btns-group actions\">\n            <a href=\"#\" class='btn btn-default' bind-url=\"&opt=1\">同意并展示</a>\n            <a href=\"#\" class='btn btn-default' bind-url=\"&opt=2\">同意不展示</a>\n            <a href=\"#\" class='btn btn-default' bind-url=\"&opt=3\">不同意</a>\n    </div>\n</div>",
                "createDate": 1421637797000,
                "id": 10
            }], "limit": 20, "offset": 0, "page": 1, "pageSize": 20, "totalCount": 400, "totalPages": 1
        },
        "msg": "success"
    });




    // 添加学校
    $httpBackend.whenPOST(/^\/school$/).respond(200, {
        code: 0,
        data: {
            'id': 12
        }
    });

    // 申请邀请码
    $httpBackend.whenGET(/\/vip$/).respond(200, {
        code: 0,
        data: {
            status: 0
        }
    });

    // 申请优质投资人（当前是否是vip）
    $httpBackend.whenGET(/\/vip\/code\?action/).respond(200, {
        code: 0,
        data: {
            invitation_code_vip_status: 0
        }
    });

    // 申请优质投资人（检查邀请码是否可用）
    $httpBackend.whenGET(/\/vip\/code\/.*?\?action/).respond(200, {
        code: 0
    });

    // 申请优质投资人（优质投资人申请）
    $httpBackend.whenPOST(/\/vip/).respond(200, {
        code: 0
    });

    //标签联想
    $httpBackend.whenGET(/^\/api\/suggest\/tag\?wd=/).respond(200, {
        code: 0,
        data: {
            "data": [{
                "id": 12,
                "name": "xxx"
            }, {
                "id": 55,
                "name": "xabxx"
            }, {
                "id": 3,
                "name": "xxdsx"
            }, {
                "id": 78,
                "name": "xxdafsx"
            }]
        }
    });


    // 投资主体智能联想

    $httpBackend.whenGET(/^\/api\/suggest\/investor\?q=/).respond(200, {
        code: 0,
        data: {
            "data": [{
                "cid": 1,
                "createDate": 1421572317589,
                "investorId": 2,
                "source": "ADMIN",
                "status": "CONFIRMED",
                "type": "COMPANY",
                "investorName": "爱投资",
                "intro": "一句话简介",
                "logo": "http://placehold.it/40x40/09f/fff"
            }, {
                "cid": 1,
                "createDate": 1421572317589,
                "investorId": 2,
                "source": "ADMIN",
                "status": "CONFIRMED",
                "type": "COMPANY",
                "investorName": "爱投资",
                "intro": "一句话简介",
                "logo": "http://placehold.it/40x40/09f/fff"
            }, {
                "cid": 1,
                "createDate": 1421572317589,
                "investorId": 2,
                "source": "ADMIN",
                "status": "CONFIRMED",
                "type": "COMPANY",
                "investorName": "爱投资",
                "intro": "一句话简介",
                "logo": "http://placehold.it/40x40/09f/fff"
            }]
        }
    });

    // 学校智能联想
    $httpBackend.whenGET(/^\/api\/suggest\/school\?wd=/).respond(200, {
        code: 0,
        data: {
            "list": [{
                "id": 1,
                "name": "北京大学"
            }, {
                "id": 2,
                "name": "中国人民大学"
            }, {
                "id": 3,
                "name": "不知道大学"
            }, {
                "id": 4,
                "name": "家里蹲大学"
            }]
        }
    });

    // 成员智能联想
    $httpBackend.whenGET(/^\/api\/suggest\/user\?wd=/).respond(200, {
        code: 0,
        data: {
            "data": [{
                "id": 12,
                "name": "xxx",
                "avatar": "xxxx",
                "reason": "xxxx",
                "status": 1
            }, {
                "id": 55,
                "name": "xxx",
                "avatar": "xxxx",
                "reason": "xxxx",
                "status": 1
            }, {
                "id": 3,
                "name": "xxx",
                "avatar": "xxxx",
                "reason": "xxxx",
                "status": 1
            }, {
                "id": 78,
                "name": "xxx",
                "avatar": "xxxx",
                "reason": "xxxx",
                "status": 1
            }]
        }
    });
    $httpBackend.whenGET(/^\/api\/suggest/).respond(200, {
        code: 0,
        data: {
            "data": [{
                "id": 12,
                "logo": "http://placehold.it/40x40/09f/fff",
                "name": "36kr12345",
                "reason": "????"
            }, {
                "id": 13,
                "logo": "http://placehold.it/40x40/09f/fff",
                "name": "36krasdfghjk",
                "reason": "????"
            }, {
                "id": 5,
                "logo": "http://placehold.it/40x40/09f/fff",
                "name": "36krqwert",
                "reason": "????"
            }, {
                "id": 7,
                "logo": "http://placehold.it/40x40/09f/fff",
                "name": "36krzxcvb",
                "reason": "????"
            }]
        }
    });
    //字典接口
    $httpBackend.whenGET('/api/dictionary').respond(200, {
        code: 0,
        data: {
            "founderRoles": {
                "0": "创始人",
                "1": "联合创始人"
            }
        }
    });
    //我关注的公司
    $httpBackend.whenGET(/\/api\/follow\/company\?page\=\d+/).respond(200, {
        code: 0,
        data: {
            "data": [
                {
                    "brief": "",
                    "id": 2,
                    "logo": "",
                    "manager": 18,
                    "name": "hello"
                }
            ],
            "limit": 20,
            "offset": 0,
            "page": 1,
            "pageSize": 20,
            "totalCount": 1,
            "totalPages": 1,
            "userMap": {
                "18": {
                    "cteateTime": 1421391555000,
                    "id": 18,
                    "intro": "介绍",
                    "name": "name",
                    "updateTime": 1421391555000,
                    "weibo": "201268123"
                }
            }
        }
    });

    //添加标签接口
    $httpBackend.whenPOST('/api/tag').respond(200, {
        code: 0,
        data: {
            "id": 12,
            "name": "xxxx",
            "count": 0
        }
    });

    //添加学校接口
    $httpBackend.whenPOST('/api/school').respond(200, {
        code: 0,
        data: {
            "id": 1,
            "name": "xxxx",
            "count": 0
        }
    });
});
