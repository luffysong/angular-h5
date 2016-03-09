/**
 * Service Name: CMSService
 */

var angular = require('angular');

angular.module('defaultApp.service').service('DeviceService',
    function () {
        this.isMobile = function () {
            return /(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent);
        };
    }
);
