
var angular = require('angular');
angular.module('defaultApp.service').service('versionService', function () {

    this.getVersionAndroid = getVersionAndroid;
    this.getVersionIOS = getVersionIOS;
    this.cprVersion = cprVersion;

    function getVersionAndroid() {
        //安卓示例:36kr-Tou-Android/2.6
        var versionTou;
        var matchesTou = navigator.userAgent.match(/36kr-Tou-Android\/([0-9.]+)/i);
        if (matchesTou && matchesTou[1] && matchesTou[1].charAt(matchesTou[1].length - 1)) {
            versionTou = matchesTou[1].substr(0, matchesTou[1].length - 1);
            return versionTou;
        }
    }

    function getVersionIOS() {
        //ios示例:36kr-Tou-iOS/2.6
        var versionTou;
        var matchesTou = navigator.userAgent.match(/36kr-Tou-iOS\/([0-9.]+)/i);
        if (matchesTou && matchesTou[1] && matchesTou[1].charAt(matchesTou[1].length - 1)) {
            versionTou = matchesTou[1].substr(0, matchesTou[1].length - 1);
            return versionTou;
        }
    }

    //返回值等价于a-b
    function cprVersion(a, b) {
        var _a = toNum(a);
        var _b = toNum(b);
        if (_a === _b) {
            return 1;
        }

        if (_a > _b) {
            return 2;
        }

        if (_a < _b) {
            return 0;
        }
    }

    function toNum(value) {
        var a = value.toString();

        //也可以这样写 var c=a.split(/\./);
        var c = a.split('.');
        var numPlace = ['', '0', '00', '000', '0000'];
        var r = numPlace.reverse();
        for (var i = 0; i < c.length; i++) {
            var len = c[i].length;
            c[i] = r[len] + c[i];
        }

        var res = c.join('');
        return res;
    }

});
