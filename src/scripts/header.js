(function setHeader(win, doc) {
    var cid;

    function headerOnload() {
        if (allowRemoveHeader()) {
            removeHeader();
        }

        if (allowReplaceBanner()) {
            replaceBanner();
        }

        if (location.hash.indexOf('findKrspace') === -1 &&
            location.hash.indexOf('findWise') === -1 &&
            location.hash.indexOf('findIdeaBank') === -1 &&
            location.hash.indexOf('wonderland') === -1 &&
            location.hash.indexOf('findMusicRoadshow') === -1 &&
            location.hash.indexOf('findLogin') === -1 &&
            location.hash.indexOf('findLoginSuccess') === -1 &&
            location.hash.indexOf('findInvestor') === -1 &&
            location.hash.indexOf('firstWine') === -1 &&
            location.hash.indexOf('findInvestorSuccess') === -1 &&
            location.hash.indexOf('frInvestor') === -1 &&
            location.hash.indexOf('frInvestorSuccess') === -1 &&
            location.hash.indexOf('findStartUp') === -1 &&
            location.hash.indexOf('findStartUpSuccess') === -1 &&
            location.hash.indexOf('fractivity') === -1) {

            $('link[href*="login-theme"]').remove();
        }

    }

    function allowRemoveHeader() {
        if (location.hash.indexOf('demos') > -1 ||
            location.hash.indexOf('find') > -1 ||
            location.hash.indexOf('wonderland') > -1 ||
            location.hash.indexOf('roadShow') > -1 ||
            location.hash.indexOf('firstWine') > -1 ||
            location.hash.indexOf('frInvestor') > -1 ||
            location.hash.indexOf('findStartUp') > -1 ||
            location.hash.indexOf('fractivity') > -1 ||
            location.hash.indexOf('rongzi') > -1 ||
            location.hash.indexOf('investor/apply') > -1
            ) {
            return true;
        } else {
            return false;
        }
    }

    function allowReplaceBanner() {
        return true;
    }

    function removeHeader() {
        $('.common-header.J_commonHeaderWrapper').remove();
    }

    function replaceBanner() {
        var html = $('#topBanner').html();
        $('.app-container.J_appDownloadWrapper').replaceWith(html);
        if (/company\/\d+/.test(location.hash)) {
            $('#bannerCompany').show();
            $('#bannerOther').hide();

            var split = location.href.split('company/');
            if (split[1]) {
                cid = split[1];
                $('#goDownLoad').attr('href', 'http://36kr.com/company/' + cid + '?fromShare=1&ktm_source=rong.h5.download.' + cid);
            } else {
                $('#goDownLoad').attr('href', 'http://huodong.36kr.com/h5/investor-app/hub.html?ktm_source=rongh5dingbu');
            }

        } else {
            $('#bannerCompany').hide();
            $('#bannerOther').show();
        }
    }

    function writeHeader() {
        doc.write('<script src="%%%headerSrc%%%" onload="headerOnload()" name="rong" ><\/script>');
    }

    function download() {
        console.log('test');
        var userSystem = navigator.userAgent; //userAgent
        if (userSystem.indexOf('Android') > -1) {
            krtracker('trackEvent', 'click', 'android.h5.rongh5dingbu.download.' + cid);
        }else if (/iphone/i.test(userSystem)) {
            krtracker('trackEvent', 'click', 'ios.h5.rongh5dingbu.download.' + cid);
        }
    }

    writeHeader();
    win.headerOnload = headerOnload;
}(window, document));
