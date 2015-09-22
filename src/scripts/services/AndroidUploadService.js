/**
 * Service Name: AndroidUploadService
 */

var angular = require('angular');

androidUploadFileCallback = function () {

}

//window.kr36 = {
//    chooseFile : function(){}
//}

function logdiv(msg) {
    if ($('.logdiv').length == 0) {
        $('<div class="logdiv" style="position: fixed; top: 0;left: 0;width: 100px;height: 100px;background-color: #cccc99;z-index: 999;"></div>').appendTo('body')
    }
    $('.logdiv').html(msg)
}

angular.module('defaultApp.service').service('AndroidUploadService',
    function () {

        var service = {
            setClick: function (callback) {

                androidUploadFileCallback = callback;

                return function (e) {
                    if (!window.kr36 || !window.kr36.chooseFile) {
                        //logdiv('没有注入方法')
                        return function () {
                        };
                    }
                    e.preventDefault();
                    //if (e.currentTarget.name == 'logo') {
                    //    window.kr36.tempCache.imgsource = 'logo';
                    //} else if (e.currentTarget.name == 'bizCardLink') {
                    //    window.kr36.tempCache.imgsource = 'bizCardLink';
                    //}

                    logdiv(e.currentTarget.name)

                    setTimeout(function () {
                        logdiv('有注入方法，立刻调用')
                        window.kr36.chooseFile();

                    }, 100)
                }

            }
        };


        return service;
    }
);
