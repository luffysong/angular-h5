/**
 * Directive Name: krSwiper
 */

/* globals Swiper */

var angular = require('angular');

angular.module('defaultApp.directive').directive('swiperOrigin',
    function ($timeout) {
        return {
            restrict: 'A',
            scope: {
                slides:'=slides',
                callback: '&'
            },
            link: function (scope, element) {
                scope.$watch('slides', function () {
                    if (scope.slides && scope.slides.length > 1) {
                        $timeout(makeSwiper, 100);
                    }

                    function makeSwiper() {
                        window.mySwiper = new Swiper(element[0], {
                            initialSlide: 100, //最后一个选中,100只是设置的比较大的数,理论上不会超过100个轮播
                            loop: false,
                            speed: 500,
                            slidesPerView: 1,
                            freeMode: false,
                            longSwipesRatio:0.3,
                            resistanceRatio:0,
                            prevButton:'.arrowLeft',
                            nextButton:'.arrowRight',
                            onSlideChangeEnd: function (swiper) {
                                scope.callback(
                                    {
                                        previousIndex: swiper.previousIndex,
                                        activeIndex: swiper.activeIndex
                                    }
                                );
                            }
                        });
                    }

                });
            },
        };
    }
);
