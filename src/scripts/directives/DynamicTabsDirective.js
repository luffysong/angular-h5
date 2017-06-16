/**
 * Directive Name: slideTabs
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('dynamicTabs',
    function ($timeout, $swipe) {
        return {
            require: '^ngModel',
            restrict: 'AE',
            template: '<div class="slide-tabs" ng-if="tabs.length" ng-swipe-left="moveAction($event,true)" ng-swipe-right="moveAction($event,false)"><div class="wrapper" ><a href="javascript:void(0)" class="tab" ng-repeat="tab in tabs" id="{{tab.id}}" ng-click="setTab(tab)" ng-class="{selected:tab.selected}" }"><span>{{tab.label}}</span></a><span class="bar" ng-style="{width:bar.width,transform:bar.transform}"></span></div></div>',
            scope: {
                tabs: '=dynamicTabs',
                isspan:'=isspan',
                setFn: '&setFn',
                barwidth: '@barwidth',
                limit:'@limit'
            },
            link: function (scope, element, attrs, ngModelCtrl) {
                var _tabLength = scope.tabs.length;
                var clienWidth = element.width();
                var barwidth = scope.barwidth;
                var limit = parseInt(scope.limit);

                function setWrapper(fn, index, f) {
                    $timeout(function () {
                        var wrapper = element.find('.wrapper');
                        var w = wrapper.find('.selected').width();
                        if (_tabLength < limit ||  _tabLength == limit) {
                            w = clienWidth /(_tabLength);
                        }
                        wrapper.css('width',(_tabLength * w + 'px' ));
                        wrapper.find('a').css('width', w);
                        if (fn) {
                            fn(index, f);
                        }

                        if (f === 'f' && (index +1) > limit ) {
                            setCurrentTab(index, w);
                        }
                    },200);
                }

                function setCurrentTab(index, wd) {
                    var wrapper = element.find('.wrapper');
                    var ww = wrapper.width();
                    wd = wd * (index + 1 - limit);
                    wrapper.css('transition', 'left 0.3s');
                    wrapper.css('left', '-' + wd + 'px');
                }

                function setBarState(index, f) {
                        var selected = $('.tab', element).eq(index);
                        var wrapper = selected.parent();
                        var width = selected.find('span').width();
                        var offsetLeft = selected.find('span').offset().left;
                        var _aw = wrapper.find('a').css('width').replace('px','');
                        var _w =  clienWidth /(_tabLength);
                        var wl = Math.abs(wrapper.css('left').replace('px',''));

                        if (!scope.isspan) {
                            var width = selected.width();
                            var offsetLeft = selected.offset().left;
                        }
                        if (wl) {
                            offsetLeft = offsetLeft + wl;
                        }

                        var plusLeft = 0;
                        if ((width - parseInt(barwidth)) > 0 ) {
                            plusLeft = parseInt(width - parseInt(barwidth));
                        }

                        if (_aw != _w && f === 'f') {
                            var _w2;
                            if (_tabLength >limit ) {
                                _w2=  clienWidth /limit/2 +  clienWidth /limit * index;
                            } else {
                                _w2=  clienWidth /_tabLength/2;
                            }
                            offsetLeft = _w2 - parseInt(barwidth/2);
                        } else {
                            offsetLeft = offsetLeft + parseInt(plusLeft/2);
                        }

                        var leftProp = 'translate3d(' + offsetLeft+ 'px,0,0)';
                        scope.bar = {
                            width: parseInt(barwidth) + 'px',
                            transform: leftProp
                        };

                }

                ngModelCtrl.$formatters.push(function (modelValue) {
                    var result;
                    scope.tabs.forEach(function (tab, index) {
                        if (modelValue === tab.value) {
                            result = tab;
                            tab.selected = true;
                            setWrapper(setBarState,index, 'f');
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
                            setWrapper(setBarState,index);
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

                scope.moveAction = function (e, c) {
                    e.stopPropagation();
                    var wrapper = element.find('.wrapper');
                    var wd = wrapper.find('.selected').width();
                    var wl = wrapper.css('left').replace('px','');
                    var leftProp;
                    if (c) {
                        var l = wl/wd ? wl/wd : 0;
                        //console.log(l);
                        leftProp = (Math.abs(l) + 1) <= (_tabLength-limit) ? ((l-1) * wd) : 0;
                        //console.log('left', wd, wl, leftProp);
                    } else {
                        var l = wl/wd ? wl/wd : 0;
                        leftProp = l==0 ? 0: ((l+1) * wd);
                        //console.log('right', wd, wl, leftProp);
                    }
                    wrapper.css('transition', 'left 0.3s');
                    wrapper.css('left', leftProp + 'px');
                };
            }
        };
    }
);
