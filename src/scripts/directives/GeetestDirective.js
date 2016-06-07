/**
 * Directive Name: geetest
 */
/* globals initGeetest */
var angular = require('angular');

angular.module('defaultApp.directive').directive('geetest',
    function ($http, UserService) {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                callback: '=callback',
                type: '=type',
                phone: '=phone',
                isVoice: '=isVoice'
            },
            link: function (scope, element) {
                var geetestData = {};
                UserService.gee.initCode({
                    phone: scope.phone,
                    isVoice: scope.isVoice
                }).$promise.then(function (res) {
                    initGeetest({
                        gt: res.geetest_gt,
                        challenge: res.geetest_challenge,
                        product: scope.type
                    }, function (captchaObj) {
                        $(element).empty();
                        captchaObj.appendTo(element);
                        captchaObj.refresh();
                        captchaObj.onSuccess(function () {
                            geetestData = captchaObj.getValidate();
                            scope.callback(geetestData);
                        });

                        captchaObj.onFail(function () {

                        });

                        captchaObj.getValidate(); // 获取成功后的验证信息，失败是返回false
                    });
                });
            }
        };
    }
);
