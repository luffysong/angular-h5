
var angular = require('angular');
angular.module('defaultApp.service').service('hybrid', function () {

    this.isInApp = !!navigator.userAgent.match(/36kr/) || window.isAppAgent;
    this.openProject = openProject;
    this.open = open;

    function call(url) { //定义startApp函数
        var ifr = document.createElement('iframe');
        ifr.src = url;
        ifr.style.display = 'none';
        document.body.appendChild(ifr);
        window.setTimeout(function () {
            document.body.removeChild(ifr);
            ifr = null;
        }, 200);
    }

    function buildUrl(path) {
        return 'krtou:/' + path;
    }

    function open(path) {
        call(buildUrl(path));
    }

    function openProject(id, ccid, demosid) {

        //安卓示例:36kr-Tou-Android/2.6  ios示例:36kr-Tou-iOS/2.6
        var matchesTou = navigator.userAgent.match(/36kr-Tou-[a-zA-Z]{3,7}\/([0-9]\.[0-9])/i);

        var versionTou = matchesTou && matchesTou[1] && parseFloat(matchesTou[1]);
        if (versionTou && versionTou > 2.5) {
            call(buildUrl('/crmCompany/' + ccid + '?ktm_source=' + demosid));
        } else if (versionTou && versionTou <= 2.5) {
            call(buildUrl('/company/' + id));
        }

    }
});
