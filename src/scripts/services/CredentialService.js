/**
 * Service Name: CredentialService
 */

var angular = require('angular');

angular.module('defaultApp.service').service('CredentialService',
    function ($state) {

        var LOGIN_BASE = '/user/login?from=';
        this.directToLogin = function (url) {
            location.href = LOGIN_BASE + encodeURIComponent(url || location.href);
        };

        this.directToWelcome = function (url) {
            $state.go('guide.welcome', {
                from:encodeURIComponent(url || location.href)
            });
        };
    }
);
