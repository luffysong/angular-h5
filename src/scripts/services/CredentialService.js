/**
 * Service Name: CredentialService
 */

var angular = require('angular');

angular.module('defaultApp.service').service('CredentialService',
    function ($state, $http) {

        var LOGIN_BASE = '/user/login?from=';
        var PASSPORT_HOST = '';

        this.directToLogin = function (url) {
            location.href = LOGIN_BASE + encodeURIComponent(url || location.href);
        };

        this.directToLoginSimple = function (url) {
            var loginSimple = url || location.href;
            location.href = LOGIN_BASE + encodeURIComponent(loginSimple) + '#/login-simple';
        };

        this.logout = function () {
            return $http.get(PASSPORT_HOST + '/user/logout');
        };

        this.directToWelcome = function (url) {
            $state.go('guide.welcome', {
                from:encodeURIComponent(url || location.href)
            });
        };

    }
);
