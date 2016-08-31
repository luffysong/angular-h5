/**
 * Service Name: AndroidUploadService
 */

var angular = require('angular');

window.androidUploadFileCallback = function () {

};

//window.kr36 = {
//    chooseFile: function () {}
//};
//
//function logdiv(msg) {
//    if (!$('.logdiv').length) {
//        $('<div class="logdiv" style="position: fixed; top: 0;left: 0;' +
//            'width: 100px;height: 100px;' +
//            'background-color: #cccc99;z-index: 999;"></div>'
//        ).appendTo('body');
//    }
//
//    $('.logdiv').html(msg);
//}

angular.module('defaultApp.service').service('AndroidUploadService',
    function () {

        var service = {
            setClick: function (callback, type) {
                //logdiv('setClick');
                //type:1 为方图，0 为原图

                window.androidUploadFileCallback = callback;

                return function (e) {
                    if (!window.kr36 || !window.kr36.chooseFile) {
                        //logdiv('没有注入方法');
                        return function () {};
                    }

                    e.preventDefault();
                    setTimeout(function () {
                        //logdiv('chooseFile', $(e.currentTarget).attr('name'));
                        window.kr36.tempCache = {};
                        window.kr36.tempCache.imgsource =
                            $(e.currentTarget).attr('name');
                        var matchesTou = navigator.userAgent.match(/36kr-Tou-Android\/([0-9]\.[0-9])/i);
                        var matchesMedia = navigator.userAgent.match(/com.android36kr.app\/([0-9]\.[0-9])/i);
                        var versionTou = matchesTou && matchesTou[1] && parseFloat(matchesTou[1]);
                        var versionMedia = matchesMedia && matchesMedia[1] && parseFloat(matchesMedia[1]);
                        if ((versionTou && versionTou > 2.1) || (versionMedia && versionMedia > 5.0)) {
                            window.kr36.chooseFile(type || 0);
                        } else {
                            window.kr36.chooseFile();
                        }
                    }, 100);
                };

            }
        };
        return service;
    }
);
