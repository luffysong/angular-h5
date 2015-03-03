/**
 * Filter Name: Image
 */

var angular = require('angular');

var defaults = {
    avatar: 'http://krplus.b0.upaiyun.com/default_avatar.png',
    logo: 'http://krplus.b0.upaiyun.com/default_logo.png'
};
var sizeArr = [20,30,50,70,100,120,200,500,800]


angular.module('defaultApp.filter').filter('image', function () {
    return function (input, size, type) {
        size = size || 800;
        type = type || 'logo';
        var realSize = 800, distance = 800;
        var src = input;

        sizeArr.forEach(function(s){
            var dis = Math.abs(size - s);
            if(dis < distance){
                distance = dis;
                realSize = s;
            }
        });

        if(!input || input.indexOf('http')==-1){
            src = defaults[type];
        }
        if(src.indexOf('http://krplus.b0.upaiyun.com/')>-1){
            src = src.replace(/\!.+$/, "");
            src = src+'!'+realSize;
        }

        return src;
    };
});
