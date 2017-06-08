/**
 * Directive Name: slideTabs
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('slideTabs',
    function ($timeout) {
        return {
            require: '^ngModel',
            restrict: 'AE',
            template: '<div class="slide-tabs" ng-if="tabs.length"><div class="wrapper"><a href="javascript:void(0)" class="tab" ng-repeat="tab in tabs" ng-click="setTab(tab)" ng-class="{selected:tab.selected}" }"><span>{{tab.label}}</span></a><span class="bar" ng-style="{width:bar.width,transform:bar.transform}"></span></div></div>',
            scope: {
                tabs: '=slideTabs',
                isspan:'@isspan'
            },
            link: function (scope, element, attrs, ngModelCtrl) {

                function setBarState(index) {
                    $timeout(function () {
                        var selected = $('.tab', element).eq(index);
                        var width = selected.find('span').width();
                        var offsetLeft = selected.find('span').offset().left;
                        if (!isspan) {
                            var width = selected.width();
                            var offsetLeft = selected.offset().left;
                        }

                        var leftProp = 'translate3d(' + offsetLeft + 'px,0,0)';
                        scope.bar = {
                            width:width + 'px',
                            transform: leftProp
                        };
                    }, 200);
                }

                ngModelCtrl.$formatters.push(function (modelValue) {
                    var result;
                    scope.tabs.forEach(function (tab, index) {
                        if (modelValue === tab.value) {
                            result = tab;
                            tab.selected = true;
                            setBarState(index);
                        }
                    });

                    return result;
                });

                ngModelCtrl.$render = function () {
                };

                ngModelCtrl.$parsers.push(function (viewValue) {
                    scope.tabs.forEach(function (tab, index) {
                        if (viewValue === tab) {
                            tab.selected = true;
                            setBarState(index);
                        }else {
                            tab.selected = false;
                        }
                    });

                    return viewValue.value;
                });

                scope.setTab = function (item) {
                    scope.$emit('tabClicked', item);
                    ngModelCtrl.$setViewValue(item, 'change');
                };
            }
        };
    }
);
