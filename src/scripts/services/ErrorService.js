/**
 * Service Name: ErrorService
 */

var angular = require('angular');

angular.module('defaultApp.service').service('ErrorService', [
    '$location', 'notify',
    function($location, notify) {

        var service = {
            alert: function(err) {
                if (err && err.msg) {
                    notify.closeAll();
                    notify({
                        message:err.msg,
                        classes:'alert-danger'
                    });
                }else if (err) {
                    notify.closeAll();
                    notify({
                        message:'服务器端未知原因错误',
                        classes:'alert-danger'
                    });
                }
            }
        };

        return service;
    }
]);
