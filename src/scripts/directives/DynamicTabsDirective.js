/**
 * Directive Name: slideTabs
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('dynamicTabs',
    function ($timeout, $swipe) {
        return {
            require: '^ngModel',
            restrict: 'AE',
            //ng-swipe-left="moveAction($event,true)" ng-swipe-right="moveAction($event,false)"
            template: '<div class="slide-tabs" ng-if="tabs.length" ><div class="wrapper" ><a href="javascript:void(0)" class="tab" ng-repeat="tab in tabs" id="{{tab.id}}" index="{{tab.value}}" ng-click="setTab(tab)" ng-class="{selected:tab.selected}" }"><span>{{tab.label}}</span></a><span class="bar" ng-style="{width:bar.width,transform:bar.transform}"></span></div></div>',
            scope: {
                tabs: '=dynamicTabs',
                isspan:'=isspan',
                barwidth: '@barwidth',
                limit:'@limit',
                currtab:'=currtab',
            },
            link: function (scope, element, attrs, ngModelCtrl) {
                var _tabLength = scope.tabs.length;
                var clienWidth = element.width();
                var barwidth = scope.barwidth;
                var limit = parseInt(scope.limit);
                var wrapper;
                var setCurrentTab;
                var aWidth;
                var cutWidth;
                var cutLeft;
                var checkIfMoveTab;

                cutWidth = function(w) {
                    //当修改露出下一个tab的时候，是露出一半，把一半的距离转嫁到所有的tab上；
                    //不应该是露出一半，而应该是凑够屏幕的宽度；
                    if(_tabLength > limit) {
                        var cl = clienWidth - w * limit;
                        w = parseInt(w - w/2/_tabLength);
                    }
                    return w ;
                }

                cutLeft = function(aWidth, index, offsetLeft, plusLeft) {
                    if (aWidth) {
                        var _w2;
                        //原来是依靠clienWidth来算出每个tab的宽度，现在没法算出，只能
                        // if (_tabLength >limit ) {
                        //     //clienWidth /limit/2 +不需要在加一半
                        //     if(index) {
                        //         _w2 = aWidth * index + aWidth/2;
                        //     } else {
                        //         _w2 = aWidth/2;
                        //     }
                        // } else {
                        //     _w2=  (clienWidth /_tabLength) * index + clienWidth /_tabLength/2;
                        // }
                        if (index) {
                            _w2 = aWidth * index + aWidth/2;
                        } else {
                            _w2 = aWidth/2;
                        }
                        offsetLeft = _w2 - parseInt(barwidth/2);
                    }
                    return offsetLeft;
                }

                function setWrapper(fn, index, f) {
                    $timeout(function () {
                        wrapper = element.find('.wrapper');
                        var w = wrapper.find('.selected').width();
                        if (!aWidth) {
                            aWidth = w;
                        }
                        if (_tabLength < limit ||  _tabLength == limit) {
                            w = clienWidth /(_tabLength);
                        }

                        if (cutWidth) {
                            w = cutWidth(w);
                            cutWidth = null;
                        }

                        wrapper.css('width',(_tabLength * w + 'px' ));
                        wrapper.find('a').css('width', w);

                        if (fn) {
                            fn(index, w);
                        }
                    },0);
                }

                setCurrentTab = function(index) {
                    $timeout(function () {
                        var wrapper = element.find('.wrapper');
                        var w = wrapper.find('.selected').width();
                        var _w = w;
                        if ((index +1) == _tabLength) {
                            w = w * (index - limit) + _w/2;
                        } else if(index < limit){
                            w = 0;
                        } else {
                            w = w * (index + 1 - limit);
                        }
                        w = Math.ceil(w);

                        wrapper.css('transition', 'left 0.3s');
                        wrapper.css('left', w == 0 ? '0px' : '-' + w + 'px');
                    },500);
                }

                function setBarState(index, aWidth) {
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

                        if (cutLeft) {
                            offsetLeft = cutLeft(aWidth, index, offsetLeft, plusLeft);
                            cutLeft = null;
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
                            if ((index +1) > limit){
                                setCurrentTab(index);
                            }
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
                            scope.currtab = index;
                            setCurrentTab(index);
                        }else {
                            tab.selected = false;
                        }
                    });

                    return viewValue.value;
                });

                scope.setTab = function (item) {
                    //console.log(item);
                    //scope.$parent.$parent.$parent.changeobj = item;
                    scope.$emit('DynamicTabClicked', item);
                    ngModelCtrl.$setViewValue(item, 'change');
                };

                scope.moveAction = function (e, c) {
                    e.stopPropagation();
                    var wrapper = element.find('.wrapper');
                    var wd = wrapper.find('.selected').width();
                    var wl = wrapper.css('left').replace('px','');
                    //当tab减半的时候加的
                    if (_tabLength > limit) {
                        wd = wd / 2;
                    }

                    var leftProp;
                    if (c) {
                        var l = wl/wd ? wl/wd : 0;
                        leftProp = (Math.abs(l) + 1) <= (_tabLength-limit) ? ((l-1) * wd) : 0;
                    } else {
                        var l = wl/wd ? wl/wd : 0;
                        leftProp = l==0 ? 0: ((l+1) * wd);
                    }

                    wrapper.css('transition', 'left 0.3s');
                    wrapper.css('left', leftProp + 'px');
                };

                // //监听变化对象，以此来实现左右滑动
                // scope.$watch('changeobj', function (obj) {
                //     if(obj && 'id' in obj ||
                //         obj && 'id' in obj
                //         && obj.id == 0){
                //         scope.setTab(obj);
                //         setCurrentTab(obj.value);
                //     }
                // });

                scope.$on('bdSwipeMoveAction',function(event, obj){
                        if(obj && 'id' in obj ||
                            obj && 'id' in obj
                            && obj.id == 0){
                            scope.setTab(obj);
                            //setCurrentTab(obj.value);
                        }
                });
            }
        };
    }
);
