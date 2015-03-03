var HeaderInterval = setInterval(function(){
    if(!window.$){
        return;
    }
    clearInterval(HeaderInterval);
    var template = {{html}}+{{css}};
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
