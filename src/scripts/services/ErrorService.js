/**
 * Service Name: ErrorService
 */

var angular = require('angular');

angular.module('defaultApp.service').service('ErrorService', [
    '$location', 'notify',
    function ($location, notify) {

        var service = {
            alert: function (err) {

                notify.closeAll();
                var className = 'alert-danger';

                if (typeof err === 'string') {
                    notify({
                        message: err,
                        classes: className
                    });
                } else if (err && err.msg) {
                    notify({
                        message:err.msg,
                        classes:className
                    });
                }else if (err) {
                    notify({
                        message:JSON.stringify(err),
                        classes:className
                    });
                    /*notify({
                        message:'服务器端未知原因错误',
                        classes:className
                    });*/
                }
            }
        };

        return service;
    }
]);
