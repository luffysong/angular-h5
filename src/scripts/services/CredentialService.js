/**
 * Service Name: CredentialService
 */

var angular = require('angular');

angular.module('defaultApp.service').service('CredentialService',
    function ($state, $http) {

        var LOGIN_BASE = 'https://passport.36kr.com/pages/?ok_url=';
        var PASSPORT_HOST = '';

        this.directToLogin = function (url) {
            location.href = LOGIN_BASE + encodeURIComponent(url || location.href);
        };

        this.directToLoginSimple = function (url) {
            var loginSimple = url || location.href;
            loginSimple =  encodeURIComponent(loginSimple) + '#/login-simple';
            location.href = LOGIN_BASE + loginSimple;
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
