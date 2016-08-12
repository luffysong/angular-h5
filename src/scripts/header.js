(function setHeader(win, doc) {

    function headerOnload() {
        if (allowRemoveHeader()) {
            removeHeader();
        }

        if (allowReplaceBanner()) {
            replaceBanner();
        }
    }

    function allowRemoveHeader() {
        return location.hash.indexOf('demos') > -1;
    }

    function allowReplaceBanner() {
        return /company\/\d+/.test(location.hash);
    }

    function removeHeader() {
        $('.common-header.J_commonHeaderWrapper').remove();
    }

    function replaceBanner() {
        var html = $('#topBanner').html();
        $('.app-container.J_appDownloadWrapper').replaceWith(html);
    }

    function writeHeader() {
        doc.write('<script src="%%%headerSrc%%%" onload="headerOnload()" name="rong" ><\/script>');
    }

    writeHeader();
    win.headerOnload = headerOnload;
}(window, document));
