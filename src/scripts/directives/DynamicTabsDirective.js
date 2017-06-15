/**
 * Directive Name: slideTabs
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('dynamicTabs',
    function ($timeout, $swipe) {
        return {
            require: '^ngModel',
            restrict: 'AE',
            template: '<div class="slide-tabs" ng-if="tabs.length" ng-swipe-left="moveAction($event,true)" ng-swipe-right="moveAction($event,false)"><div class="wrapper" ><a href="javascript:void(0)" class="tab" ng-repeat="tab in tabs" ng-click="setTab(tab)" ng-class="{selected:tab.selected}" }"><span>{{tab.label}}</span></a><span class="bar" ng-style="{width:bar.width,transform:bar.transform}"></span></div></div>',
            scope: {
                tabs: '=dynamicTabs',
                isspan:'=isspan',
            },
            link: function (scope, element, attrs, ngModelCtrl) {

                function setWrapper() {
                    var wrapper = element.find('.wrapper');
                    var w = wrapper.find('.selected').width();
                    wrapper.css('width',(scope.tabs.length * w + 'px' ));
                    wrapper.find('a').css('width', w);
                }

                $timeout(function () {
                    setWrapper();
                },200);

                function setBarState(index) {
                    $timeout(function () {
                        var selected = $('.tab', element).eq(index);
                        var wrapper = selected.parent();
                        var width = selected.find('span').width();
                        var offsetLeft = selected.find('span').offset().left;
                        var wl = Math.abs(wrapper.css('left').replace('px',''));
                        if (!scope.isspan) {
                            var width = selected.width();
                            var offsetLeft = selected.offset().left;
                        }
                        if (wl) {
                            offsetLeft = offsetLeft + wl;
                        }

                        var leftProp = 'translate3d(' + offsetLeft + 'px,0,0)';
                        scope.bar = {
                            width:width + 'px',
                            transform: leftProp
                        };
                    }, 100);
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

                var l =scope.tabs.length - 4, tl = scope.tabs.length ;
                scope.moveAction = function (e, c) {
                    e.stopPropagation();
                    var wrapper = element.find('.wrapper');
                    var wd = wrapper.find('.selected').width();
                    if (c) {
                        var wl = wrapper.css('left').replace('px','');
                          if ( l > 0 && l <= (tl-4)) {
                              wl = Math.abs(wl) + wd;
                              wrapper.css('transition', 'left 0.3s');
                              wrapper.css('left','-' + wl + 'px');
                              l = l - 1;
                          }
                    } else {
                        var wl = wrapper.css('left').replace('px','');
                        if (l >= 0 && l < (tl-4)) {
                            wl = parseInt(wl) + wd;
                            wrapper.css('transition', 'left 0.3s');
                            wrapper.css('left', wl + 'px');
                            l = l + 1;
                        }
                    }
                }
            }
        };
    }
);
