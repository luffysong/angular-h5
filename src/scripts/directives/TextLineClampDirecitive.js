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
                var $textContent = element.find('.text-content');
                $textContent.html(vm.text);
                var $toggle = element.find('.text-toggle');
                var height = $textContent[0].offsetHeight;
                var lineClamp  = '-webkit-line-clamp';
                $textContent.attr('o-height', height);
                $textContent.css('text-overflow', 'ellipsis');
                $textContent.css(lineClamp, vm.lineClamp);
                var clampHeight = $textContent[0].offsetHeight;
                $textContent.attr('cla-height', clampHeight);
                $textContent.css('height', clampHeight + 'px');
                if (clampHeight === height) {
                    $textContent.attr('isEqualHeight', 'true');
                    element.find('.text-toggle').hide();
                    return;
                }

                vm.collapse = true;
                element.find('.text-toggle').click(function viewMoreCb() {
                    if (vm.collapse) {
                        $textContent.css(lineClamp, '');
                        $textContent.css('transition', 'height 0.3s');
                        $textContent.css('height', height + 'px');
                    }else {
                        $textContent.css('transition', 'height 0.3s');
                        $textContent.css('height',  clampHeight + 'px');
                    }
                });

                $textContent[0].addEventListener('webkitTransitionEnd', function webkitTransitionEnd() {
                    if (vm.collapse && $toggle[0]) {
                        $toggle[0].innerHTML = '收起';
                        vm.collapse = false;
                    }else if ($toggle[0]) {
                        $toggle[0].innerHTML = '展开';
                        vm.collapse = true;
                        $textContent.css(lineClamp, vm.lineClamp);
                    }

                    $textContent.css('transition', '');
                }, false);
            }, controller: function () {
            }
        };
    }
);
