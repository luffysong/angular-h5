/**
 * Directive Name: meetingPicker
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('picker',
    function (PickerService) {
        return {
            require: ['^ngModel'],

            templateUrl: function (elem, attrs) {
                return attrs.templateUrl || 'templates/common/picker.html';
            },

            restrict: 'AE',
            scope: {
                items: '=picker',
                setInit: '=mpSetInit',
                map: '@mpMap',
                multiple: '=?mpMultiple',
            },
            link: function (scope, element, attrs, ctrls) {
                var modelCtrl = ctrls[0];
                scope.map = scope.map.split(',');
                scope.labelKey = scope.map[0];
                scope.valKey = scope.map[1];

                scope.$watch('items', function (val) {
                    if (!val)return;
                    var item = PickerService.getInitVal(val, scope);
                    modelCtrl.$setValidity('no-valid-option', !!item);
                    if (item && scope.setInit) {
                        return scope.doSelect(item);
                    }
                });

                scope.$watch('items', function (val) {
                    if (!val)return;
                    var item = PickerService.getInitVal(val, scope);
                    modelCtrl.$setValidity('no-valid-option', !!item);
                }, true);

                modelCtrl.$render = function () {
                    PickerService.render(modelCtrl.$viewValue, scope.items);
                };

                modelCtrl.$formatters.push(function (modelValue) {
                    return PickerService.formater(modelValue, scope);
                });

                modelCtrl.$parsers.push(function (viewValue) {
                    var modelValue = PickerService.parser(viewValue, scope);
                    return modelValue;
                });

                modelCtrl.$validators.required = function (modelValue) {
                    return !(!modelValue || (angular.isArray(modelValue) && !modelValue.length));
                };

                scope.doSelect = function (item) {
                    if (!item || item.disabled)return;
                    var selected = PickerService.select(item, scope.items, scope);
                    modelCtrl.$setViewValue(selected, 'change');
                };
            }
        };
    }

).service('PickerService', function () {
    var service = {
        getInitVal: function (items, scope) {

            var i;

            items.forEach(function (item) {
                item.label = item[scope.labelKey];
                item.value = item[scope.valKey];
            });

            for (i = 0; i < items.length; i++) {
                if (!items[i].disabled && items[i].selected) {
                    return items[i];
                }
            }

            for (i = 0; i < items.length; i++) {
                if (!items[i].disabled) {
                    return items[i];
                }
            }

            return;
        },

        render: function (item, items) {
            if (!items)return;
            if (item && item.disabled)return;
            items.forEach(function (o) {
                if (item && item.length > 0 && item.indexOf(o) !== -1 || item === o) {
                    o.selected = true;
                }else {
                    o.selected = false;
                }
            });
        },

        select: function (item, items, scope) {
            if (!items)return;
            if (item && item.disabled)return;
            var res = [];
            if (scope.multiple) {//multiple

                items.forEach(function (o) {
                    if (angular.isArray(item)) {
                        if (item.indexOf(o) !== -1) {
                            o.selected = !o.selected;
                        }
                    }else {
                        if (item === o) {
                            o.selected = !o.selected;
                        }
                    }

                    if (o.selected) {
                        res.push(o);
                    }
                });

                return res;
            }else {
                res = null;
                items.forEach(function (o) {
                    if (item === o) {
                        o.selected = true;
                        res = o;
                    }else {
                        o.selected = false;
                    }
                });

                return res;
            }
        },

        formater: function (item, scope) {
            if (!item || !scope.items)return;
            var items = scope.items;
            var res;

            if (scope.multiple) {//multiple
                res = [];
                items.forEach(function (o) {
                    if (item.indexOf(o.value) !== -1) {
                        res.push(o);
                    }
                });

                return res;
            }else {
                items.forEach(function (o) {
                    if (o.value === item) {
                        res = o;
                    }
                });

                return res;
            }
        },

        parser: function (viewValue, scope) {
            if (scope.multiple) {//multiple
                return viewValue.map(function (v) {
                    return v[scope.valKey];
                });
            }

            return viewValue[scope.valKey];
        }
    };
    return service;
});
