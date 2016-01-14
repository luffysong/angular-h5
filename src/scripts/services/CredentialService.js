/**
 * Service Name: CredentialService
 */

var angular = require('angular');

angular.module('defaultApp.service').service('CredentialService',
    function() {

        var LOGIN_BASE = '/user/login?from=';
        this.directToLogin = function(url) {
            location.href = LOGIN_BASE + encodeURIComponent(url || location.href);
        };
    }
);
