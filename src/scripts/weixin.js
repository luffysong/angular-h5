(function () {

    function checkcookie(cid) {
        var cookies = $.cookie('j3word');
        if (!cookies) {
            $.cookie('j3word', encodeURIComponent('&' + cid + '&'));
            return false;
        }

        cookies = decodeURIComponent(cookies);

        if (cookies.indexOf('&' + cid + '&') > -1) {
            return true;
        } else {
            $.cookie('j3word', encodeURIComponent(cookies + cid + '&'));
            return false;
        }

    }

    window.InitWeixin = function (obj) {
        var signature = '';
        var nonceStr = 'xcvdsjlk$klsc';
        var timestamp = parseInt(new Date().getTime() / 1000);

        $.get('/api/weixin/token', {
            url: location.href.replace(/#.*$/, ''),
            timestamp: timestamp,
            noncestr: nonceStr
        }, function (data) {
            //alert(data.data.token);
            if (data.code != 0)return;
            if (!data.data)return;
            if (!data.data.token)return;

            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: 'wxd3ea1a9a22815a8c', // 必填，公众号的唯一标识
                timestamp: timestamp, // 必填，生成签名的时间戳
                nonceStr: nonceStr, // 必填，生成签名的随机串
                signature: data.data.token,// 必填，签名，见附录1
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            wx.ready(function () {
                wx.onMenuShareTimeline({
                    title: WEIXINSHARE.shareTitle, // 分享标题
                    link: WEIXINSHARE.shareHref || location.href, // 分享链接
                    imgUrl: WEIXINSHARE.shareImg ||
                    'http://sta.36krcnd.com/common-module/common-header/images/app_logo.jpg', // 分享图标
                    success: function () {

                        // 用户确认分享后执行的回调函数
                        //if(obj && obj.cid){
                        //
                        //    if(checkcookie(obj.cid)) return;
                        //
                        //    $.ajax('/api/speed/rank/'+obj.cid, {
                        //        data:{
                        //            source:obj.source
                        //        },
                        //        type : 'PUT',
                        //        success:function(){
                        //            location.reload();
                        //        }
                        //    })
                        //}
                        obj.success && obj.success();
                    },

                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
                wx.onMenuShareAppMessage({
                    title: WEIXINSHARE.shareTitle, // 分享标题
                    desc: WEIXINSHARE.shareDesc, // 分享描述
                    link: WEIXINSHARE.shareHref || location.href, // 分享链接
                    imgUrl: WEIXINSHARE.shareImg || 'http://d.36kr.com/assets/36kr.png', // 分享图标
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        document.write($.cookies('j3word'));

                        // 用户确认分享后执行的回调函数
                        //if(obj && obj.cid){
                        //    $.ajax('/api/speed/rank/'+obj.cid, {
                        //        data:{
                        //            source:obj.source
                        //        },
                        //        type : 'PUT',
                        //        success:function(){
                        //            location.reload();
                        //        }
                        //    })
                        //}
                        obj.success && obj.success();

                    },

                    cancel: function () {
                        // 用户取消分享后执行的回调函数

                    }
                });
            });

            wx.error(function (res) {

                //alert(data.data.token);
                //alert(JSON.stringify(res, null, 4));
                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。

            });

        }, 'jsonp');

    };

})();
