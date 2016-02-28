/**
 * Service Name: CheckFormService
 */

var angular = require('angular');

angular.module('defaultApp.service').service('checkForm', [
    '$location', '$http', '$rootElement',
    function ($location, $http, $rootElement) {
        return function (name, pre) {
            var form = $($rootElement).find('form[name="' + name + '"]');
            var formCtrl = angular.element(form).scope()[name];
            pre && pre(formCtrl);
            formCtrl && Object.keys(formCtrl).forEach(function (key) {
                var item = formCtrl[key];
                if (item && item.$setDirty) {
                    item.$setDirty();
                }
            });

            if (formCtrl && formCtrl.$invalid) {
                form.find('.ng-invalid').eq(0).focus();
                return false;
            }

            return true;
        };
    }
]);
