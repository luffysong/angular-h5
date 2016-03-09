/**
 * Service Name: LoginService
 */

var angular = require('angular');

angular.module('defaultApp.service').service('LoginService',
    function (BasicService) {

        var service = BasicService('https://' + projectEnvConfig.passportHost + '/:action/:sub/:sub_action', {

            /**
             * 获取国际手机前辍
             */
            getCountryDict: {
                method: 'GET',
                isArray: true,
                params: {
                    action: 'dict',
                    sub: 'cc'
                }
            }
        });

        return service;
    }
);
