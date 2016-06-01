/**
 * Service Name: PopCaptchaService
 */

var angular = require('angular');

angular.module('defaultApp.service').service('PopCaptcha',
    function ($modal) {
        var service = {
            show: function (phone, isVoice) {
                return $modal.open({
                    templateUrl: 'templates/util/pop-captcha.html',
                    backdrop: 'static',
                    windowClass: 'pop-geetest',
                    controller: function ($scope, $modalInstance) {
                        $scope.type = 'embed';
                        $scope.phone = phone;
                        $scope.isVoice = isVoice;
                        $scope.callback = function (res) {
                            $modalInstance.close(res);
                        };
                    }
                });
            }
        };
        return service;
    }
);
