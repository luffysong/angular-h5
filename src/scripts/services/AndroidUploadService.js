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
            setClick: function (callback) {
                //logdiv('setClick');

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
                        window.kr36.chooseFile();
                    }, 100);
                };

            }
        };
        return service;
    }
);
