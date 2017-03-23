/**
 * Filter Name: Image
 */

var angular = require('angular');

var sizeArr = [20, 30, 50, 70, 100, 120, 200, 500, 640, 800];

angular.module('defaultApp.filter').filter('image', function () {
    var defaults = {
        avatar: kr.defaultImg.defaultAvatarUrl,
        logo: kr.defaultImg.defaultNullUrl,
        user: kr.defaultImg.defaultUserUrl
    };
    return function (input, size, type) {
        size = size || 800;
        type = type || 'logo';
        var realSize = 800;
        var distance = 800;
        var src = input;

        sizeArr.forEach(function (s) {
            var dis = Math.abs(size - s);
            if (dis < distance) {
                distance = dis;
                realSize = s;
            }
        });

        if (!input) {
            src = defaults[type];
        }

        src = src.replace('krplus-pic.b0.upaiyun.com', 'pic.36krcnd.com');
        if (src.indexOf('pic.36krcnd.com/') > -1) {
            src = src.replace(/\!.+$/, '');
            src = src + '!' + realSize;
        }

        return src;
    };
}).directive('img', function () {
    return function (scope, elem) {
        elem[0].onerror = function () {
            elem[0].src = kr.defaultImg.defaultNullUrl;
        };
    };
});
