/**
 * Directive Name: errorWrapper
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('errorWrapper',
    function () {
        return {
            require: '^^form',
            restrict: 'AE',
            templateUrl: 'templates/common/error-wrapper.html',
            scope: {
                errorGroup: '=errorGroup'
            },
            bindToController: true,
            controllerAs: 'vm',
            link: function (scope, element, attrs, formCtrl) {
                var vm = scope.vm;
                vm.formCtrl = formCtrl;
                vm.formName = formCtrl.$name;
                vm.form = document.getElementsByName(formCtrl.$name)[0];
            },

            controller: errorWrapperController
        };
    }
);

function errorWrapperController() {
    var vm = this;
    var BASE_Z_INDEX = 1000;
    vm.getZindex = getZindex;

    // function reorderError(name) {
    //     if (!name)return;
    //     var form = document.getElementsByName(name);
    //     var $controls = $('input select', form);
    //     var errorGroupCopy = angular.copy(vm.errorGroup);
    //     var errors = [];
    //     $controls.each(function lockError(ele) {
    //         errors.concat(errorGroupCopy.filter(function compareName(data) {
    //             errorGroupCopy.remove(data);
    //             return data.name === ele.name;
    //         }));
    //     });
    //
    //     errors.reverse();
    //     return errors;
    // }

    function getZindex(field) {
        var controls = $('input,select', vm.form).toArray();
        var currentControl = vm.form[field];
        if (!currentControl) return -1;
        return BASE_Z_INDEX - controls.indexOf(currentControl);
    }

}
