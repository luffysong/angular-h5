/**
 * Directive Name: krSwiper
 */

/* globals Swiper */

var angular = require('angular');

angular.module('defaultApp.directive').directive('krSwiper',
    function ($timeout) {
        return {
            restrict: 'A',
            scope: '=slides',
            link: function (scope, element) {
                scope.$watch('slides', function () {
                    var img;
                    if (scope.slides && scope.slides.length > 1) {
                        img = element.find('img')[1];
                        $timeout(makeSwiper, 100);
                    }

                    function makeSwiper() {
                        if (!img.src) {
                            $timeout(makeSwiper, 100);
                        }

                        var slidesLength =  scope.slides.length;
                        var swiper = new Swiper(element[0], {
                            autoplay: 2000,
                            loop: true,
                            speed: 1000,
                            slidesPerView: 1,
                            onSlideChangeEnd: function () {

                                //更新轮播索引
                                scope.$evalAsync(function () {
                                    scope.slides.active = swiper.activeIndex % slidesLength ||
                                        slidesLength;
                                });
                            },

                        });
                    }

                });
            },
        };
    }
);
