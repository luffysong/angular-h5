/**
 * Service Name: SuccessService
 */

var angular = require('angular');

angular.module('defaultApp.service').service('SuccessService', [
    'notify',
    function (notify) {

        this.alert = function (msg) {
            notify({
                message:msg,
                classes:'alert-success'
            });
        };
    }
]);
