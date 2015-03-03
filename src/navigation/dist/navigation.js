var HeaderInterval = setInterval(function(){
    if(!window.$){
        return;
    }
    clearInterval(HeaderInterval);
    var template = "<div class=\"nav-public J_commonPageHeader\"><!-- 已登录 --><div class=\"contain\"><nav class=\"clearfix\"><ul class=\"nav-left\"><li><a href=\"{{36kr_host}}\">首页</a></li><li><a href=\"{{kr_plus_host}}\">融资</a></li><li><a href=\"{{kr_space_host}}\">氪空间</a></li><li><a href=\"{{next_host}}\">NEXT</a></li></ul><ul class=\"nav-right J_unLoginUserWrap\"><li><a href=\"#\">申请融资</a></li><li><a href=\"{{report_host}}\">寻求报道</a></li><li><a href=\"javascript:void(0)\" class=\"J_loginInBtn\">登录</a></li></ul><ul class=\"nav-right J_loginUserWrap\"><li><a href=\"#\">申请融资</a></li><li><a href=\"{{report_host}}\">寻求报道</a></li><li class=\"message\"><a href=\"javascript:void(0)\">\t\t\t\t\t\t\t消息<span class=\"J_totalMsgCount\"></span></a><ul class=\"clearfix\"><li><a href=\"{{kr_plus_host}}/#/message\">投融资消息</a><span class=\"J_investMsg\"></span></li><li><a href=\"#\">文章评论</a><span class=\"J_commentMsg\"></span></li></ul></li><li class=\"user\"><a href=\"{{kr_plus_host}}/#/user/{{user_id}}/edit\"><img src=\"{{user_avatar}}\" width=\"20\" height=\"20\" alt=\"\"><span> {{user_name}}</span></a><ul class=\"clearfix\"><li><span>我</span></li><li class=\"company\"><a href=\"{{kr_plus_host}}/#/user/{{user_id}}/edit\">我的档案</a><ul><li><span>我创建的公司</span></li>                                    {{company_list}}<li><a href=\"{{kr_plus_host}}/#/company/create\"><i class=\"glyphicon glyphicon-plus\"></i>\t\t\t\t\t\t\t\t\t\t\t创建公司</a></li></ul></li><li><a href=\"{{kr_plus_host}}/#/follow/1\">我关注的公司</a></li><li><a href=\"{{kr_plus_host}}/#/setting/vip\">账号设置</a></li><li><a href=\"javascript:void(0)\" class=\"J_loginOutBtn\">退出登录</a></li></ul></li></ul></nav></div></div>"+"<style>body {\n\tmargin: 0;\n}\n\n.nav-public {\n\tfont-family: \"Open Sans\", Arial, \"Hiragino Sans GB\", \"Microsoft YaHei\", \"微软雅黑\", \"STHeiti\", \"WenQuanYi Micro Hei\", SimSun, sans-serif;\n\tfont-size: 14px;\n\tline-height: 20px;\n\tcolor: #333;\n    z-index: 1000;\n    background: #fff;\n    position: absolute;\n    top:0;\n    left:0;\n    width:100%;\n}\n\n.nav-public .clearfix:before, .nav-public .clearfix:after {\n\tcontent: \"\";\n\tdisplay: table;\n}\n.nav-public .clearfix:after {\n\tclear: both;\n}\n\n.nav-public .contain {\n\tmargin: 0 auto;\n\tbox-sizing: border-box;\n}\n\n.nav-public nav {\n\tline-height: 24px;\n}\n\n.nav-public ul {\n\tmargin: 0;\n\tpadding: 0;\n\tlist-style: none;\n}\n.nav-public ul\n.nav-public .nav-left{\n\tfloat: left;\n}\n.nav-public .nav-right{\n\tfloat: right;\n}\n.nav-public .nav-right>li:hover {\n    background: #f3f3f3;\n}\n\n.nav-public a {\n\tfloat: left;\n\tcolor: #333;\n\ttext-decoration: none;\n}\n\n.nav-public .nav-left > li {\n\tfloat: left;\n\tpadding: 8px 22px;\n}\n\n.nav-public .nav-right > li {\n\tfloat: left;\n\tposition: relative;\n\theight: 40px;\n}\n.nav-public .nav-right > li > a {\n\tpadding: 8px 20px;\n\tmin-width: 100px;\n\ttext-align: center;\n\tposition: relative;\n\t-webkit-box-sizing: border-box;\n\t-moz-box-sizing: border-box;\n\tbox-sizing: border-box;\n}\n\n.nav-public .nav-right > li ul {\n\tposition: absolute;\n\tright: 0;\n\ttop: 39px;\n\tborder: 1px solid rgba(210,210,210,.4);\n\twidth: 120px;\n\t-webkit-box-shadow: 0 0 2px #e4e4e4;\n\t-moz-box-shadow: 0 0 2px #e4e4e4;\n\tbox-shadow: 0 0 2px #e4e4e4;\n\tdisplay: none;\n\tbackground-color: #fff;\n}\n.nav-public .nav-right > li li {\n\tfloat: left;\n\twidth: 100%;\n\t-webkit-box-sizing: border-box;\n\t-moz-box-sizing: border-box;\n\tbox-sizing: border-box;\n\tbackground-color: #fff;\n}\n\n.nav-public .nav-right > li:hover > ul {\n\tdisplay: block;\n}\n.nav-public .nav-right > li > a:after {\n\tposition: absolute;\n\twidth: 1px;\n\theight: 24px;\n\tbackground-color: #dfdfdf;\n\tcontent: \"\";\n\tleft: 0;\n\ttop: 8px;\n}\n.nav-public .nav-right > li:first-child > a:after,\n.nav-public .nav-right > li:hover > a:after,\n.nav-public .nav-right > li:hover + li > a:after {\n\tbackground-color: transparent;\n}\n\n.nav-public .message a {\n\tposition: relative;\n}\n.nav-public .message a span {\n\tposition: absolute;\n\twidth: 14px;\n\tline-height: 14px;\n\t-webkit-border-radius: 100%;\n\t-moz-border-radius: 100%;\n\tborder-radius: 100%;\n\tbackground-color: #e51010;\n\tcolor: #fff;\n\tright: 20px;\n\ttop: 3px;\n\ttext-align: center;\n\tfont-size: 12px;\n}\n\n.nav-public .nav-right .message ul {\n\twidth: 140px;\n\tleft: 0;\n\tright: auto;\n}\n.nav-public .message li span {\n\tfloat: right;\n\tline-height: 16px;\n\tpadding: 0 4px;\n\tbackground-color: #e51010;\n\tcolor: #fff;\n\tmargin-top: 2px;\n\t-webkit-border-radius: 4px;\n\t-moz-border-radius: 4px;\n\tborder-radius: 4px;\n    font-size: 12px;\n}\n\n.nav-public .user {\n\tline-height: 18px;\n}\n.nav-public .user img {\n\t-webkit-border-radius: 4px;\n\t-moz-border-radius: 4px;\n\tborder-radius: 4px;\n\toverflow: hidden;\n}\n.nav-public li ul li > a,\n.nav-public li ul li > span{\n\tline-height: 20px;\n\tcolor: #6b6b6b;\n    display: block;\n    padding: 10px 15px;\n    float: none;\n}\n.nav-public li ul a:hover {\n    background: #f3f3f3;\n}\n.nav-public .user ul ul {\n\twidth: 180px;\n\tleft: -180px;\n\ttop: -1px;\n    display: block;\n\t-webkit-box-shadow: -1px 0 1px rgba(210,210,210,.4);\n\t-moz-box-shadow: -1px 0 1px rgba(210,210,210,.4);\n\tbox-shadow: -1px 0 1px rgba(210,210,210,.4);\n\theight: 201px;\n\tborder: 1px solid rgba(210,210,210,.4);\n\t/*border-right: none;*/\n}\n.nav-public .user ul li > span {\n\tcolor: #ccc;\n}\n\n\n@media (min-width: 768px) {\n\t.contain {\n\t\twidth: 750px;\n\t}\n}\n\n@media (min-width: 992px) {\n\t.contain {\n\t\twidth: 970px;\n\t}\n}\n\n@media (min-width: 1200px) {\n\t.contain {\n\t\twidth: 1200px;\n\t}\n}\n</style>";
    var originTemplate, originHeader;
    var itemTpl = '<li><a href="{{kr_plus_host}}/#/company/{{id}}">{{name}}</a></li>';
    var scriptTag = $('script[src*="dist/navigation.js"]');
    var loopInterval;
    var showHeader = function(template){
        var header = $(template);
        if(originHeader){

            originHeader.eq(0).replaceWith(header);
            header.eq(1).remove();
            header.css({
                transform: 'translate(0, 0px)'
            });
            originHeader = header;
            return;
        }
        else {
            scriptTag.replaceWith(header);
            originHeader = header;
        }

        header.css({
            transform: 'translate(0, -40px)',
            transition: 'all 0.5s'
        });
        setTimeout(function(){
            header.css({
                transform: 'translate(0, 0px)'
            });
            window.CommonHeaderProvider = {
                reload: function(){
                    init();
                }
            };
        },0);
    };
    var urls = {
    };
    window.MsgEventObj = $({});

    var startLoop = function(wrap){
        if(loopInterval){
            clearInterval(loopInterval);
            loopInterval = null;
        }
        function loop(first){
            var total = $(".J_totalMsgCount", wrap);
            var invest = $(".J_investMsg", wrap);
            var comment = $(".J_commentMsg", wrap);

            $.get(urls.msg, function(data){
                if(data.code!=0){
                    clearInterval(interval);
                    return;
                }
                var result = data.data;
                var k;
                !first && MsgEventObj.trigger('refresh', result);
                for(k in result){
                    if(lastResult[k]!=result[k] && !first){
                        MsgEventObj.trigger(k, result);
                    }
                    lastResult[k]=result[k] || 0;
                }
                total.html(lastResult.total ? '&nbsp;':"");
                invest.html(lastResult.finmailCnt + lastResult.notice + lastResult.ufinmailCnt || "");
                comment.html(lastResult.newsCnt || "");

            }, 'jsonp')
        }
        loop(true);
        var lastResult = {};
        loopInterval = setInterval(function(){
            loop();
        },30* 1000);

    };
    var init = function(){

            var template = originTemplate;
            var config = window.pageHeaderConfig;

            urls = {
                user: config.kr_plus_host + '/api/user',
                company: config.kr_plus_host + '/api/company?type=managed',
                logout: config.kr_plus_host + '/user/logout',
                login: config.kr_plus_host + '/user/login',
                msg: config.kr_plus_host + '/api/message/count'
            };

            var uid = document.cookie.match(/kr_plus_id\=(\d+)/);
            if (uid && uid.length) {
                uid = uid[1];
            }
            if(!uid){
                template = template.replace(/<img.*?>/,'');

                showHeader(template);

                $('.J_loginUserWrap').remove();
                $('.J_unLoginUserWrap').show();
            }else{

                function loadUser(){
                    $.get(urls.user + '/' + uid + '/basic', function (data) {

                        var user;
                        if (!data.code) {

                            if(data.code==0 && window.localStorage && (data.data.email||data.data.phone)){

                                localStorage.setItem('uemail', data.data.email);
                                localStorage.setItem('uphone', data.data.phone);
                                localStorage.setItem('investorType', data.data.investorType);
                            }

                            user = data.data;

                            config.user_avatar = user.avatar || 'http://krplus.b0.upaiyun.com/default_avatar.png!50';
                            config.user_name = user.name || '未填写';
                            config.user_id = user.id;

                            var html = template;
                            var k;
                            for (k in config) {
                                var reg = new RegExp('{{' + k + '}}', 'g');
                                html = html.replace(reg, config[k]);
                            }
                            showHeader(html);
                            startLoop(originHeader.eq(0));
                            $('.J_loginUserWrap').show();
                            $('.J_unLoginUserWrap').remove();


                            //退出登录
                            $('.J_loginOutBtn').click(function (e) {
                                e.preventDefault();
                                $.get(urls.logout, function () {
                                    location.reload();
                                });
                            });
                        }
                    }, 'jsonp');
                }

                $.get(urls.company, function(data){
                    if(!data.code){
                        var list = data.data.data;
                        var html = "";
                        list.forEach(function(item){
                            var k;
                            var itemHtml = itemTpl;
                            for(k in item){
                                var reg = new RegExp('{{'+k+'}}')
                                itemHtml = itemHtml.replace(reg, item[k]);
                            }
                            html += itemHtml;


                        });
                        template = template.replace('{{company_list}}',html);
                    }else{
                        template = template.replace('{{company_list}}',"");
                    }
                    loadUser();
                },'jsonp').error(function(){
                    template = template.replace('{{company_list}}',"");
                    loadUser();
                })


            }

            //登录
            $('.J_loginInBtn').click(function (e) {
                e.preventDefault();
                location.href = urls.login + "?from=" + encodeURIComponent(location.href);
            });

    };

    window.pageHeaderConfig = {};
    scriptTag
        .data('params')
        //.replace(/^.+navigation\.js\?/,'')
        .split("&")
        .forEach(function(str){
            var vals = str.split('=');
            pageHeaderConfig[vals[0]] = vals[1];
        });
    var  defaultConfig = {
        '36kr_host':'http://www.36kr.com',
        'kr_plus_host': 'http://rong.36kr.com',
        'kr_space_host': 'http://space.36kr.com',
        'next_host': 'http://next.36kr.com',
        'report_host': 'http://report.36kr.com'
    };
    var config = window.pageHeaderConfig = $.extend(defaultConfig, window.pageHeaderConfig);

    var k;
    for(k in config){
        if(config[k]=='location'){
            config[k] = 'http://'+location.hostname;
        }
        var reg = new RegExp('{{'+k+'}}', 'g');
        template = template.replace(reg, config[k]);
    }

    originTemplate = template;

    init();

},100);
