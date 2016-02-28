/**
 * Filter Name: EnityLink,EntityTarget
 */

var angular = require('angular');

angular.module('defaultApp.filter').filter('entityLink', function ($state) {
    var INVESTOR_TYPE = {
        INDIVIDUAL: 1,
        ORGANIZATION: 2,
        COMPANY: 3
    };

    var RONG_HOST = '//' + projectEnvConfig.rongHost;

    function getUISref(type, id) {
            if (type === INVESTOR_TYPE.ORGANIZATION) {
                return RONG_HOST + '/organization/' + id;
            }else if (type === INVESTOR_TYPE.INDIVIDUAL) {
                return $state.href('user_detail', { id: id });
            }else {
                return $state.href('companyDetail', { id: id });
            }
        }

    return function (type, id) {
        return getUISref(type, id);
    };
});

angular.module('defaultApp.filter').filter('entityTarget', function () {
    return function (type) {

        return type === 2 ? '_blank' : '_self';
    };
});

