
var angular = require('angular');
angular.module('defaultApp.service').factory('utls', function () {
    return {
        escapeReg:escapeReg,
        arrayTo2d: arrayTo2d
    };

    function escapeReg(str) {
        return str.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    }

    function arrayTo2d(array, count) {
        var data = array.slice(0);
        var leftArray = data.splice(0, count);
        var list2d = [];
        while (leftArray.length) {
            list2d.push(leftArray);
            leftArray = data.splice(0, count);
        }

        return list2d;

    }
});
