/**
 * Directive Name: baiduBtn
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('textLineClamp',
    function () {
        return {
            restrict: 'AE',
            transclude: {
                text: 'text',
                viewMore: '?viewMore'
            },
            template: '<div> <div ng-transclude></div>' +
                    '</div>',
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                lineClamp:'@',
                text:'='
            },
            link: function (scope, element) {
                var vm = scope.vm;
                var $p = element.find('p');
                $p.text(vm.text);
                var $a = element.find('a');
                var height = $p[0].offsetHeight;
                var lineClamp  = '-webkit-line-clamp';
                $p.css('text-overflow', 'ellipsis');
                $p.css(lineClamp, vm.lineClamp);
                var clampHeight = $p[0].offsetHeight;
                $p.css('height', clampHeight + 'px');
                if (clampHeight === height) {
                    element.find('a').hide();
                    return;
                }

                vm.collapse = true;
                element.find('a').click(function viewMoreCb() {
                    if (vm.collapse) {
                        $p.css(lineClamp, '');
                        $p.css('transition', 'height 0.3s');
                        $p.css('height', height + 'px');
                    }else {
                        $p.css('transition', 'height 0.3s');
                        $p.css('height',  clampHeight + 'px');
                    }
                });

                $p[0].addEventListener('webkitTransitionEnd', function webkitTransitionEnd() {
                    if (vm.collapse) {
                        $a[0].innerHTML = '收起';
                        vm.collapse = false;
                    }else {
                        $a[0].innerHTML = '展开';
                        vm.collapse = true;
                        $p.css(lineClamp, vm.lineClamp);
                    }

                    $p.css('transition', '');
                }, false);
            }, controller: function () {
            }
        };
    }
);
