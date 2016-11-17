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
                changeStartCallBack: '=',
                changeEndCallBack: '='
            },
            link: function (scope, element) {
                scope.$watch('slides', function () {
                    if (scope.slides && scope.slides.length > 1) {
                        $timeout(makeSwiper, 100);
                    }

                    function makeSwiper() {
                        window.mySwiper = new Swiper(element[0], {
                            initialSlide: 23,
                            loop: false,
                            speed: 500,
                            slidesPerView: 1,
                            freeMode: false,
                            longSwipesRatio:0.3,
                            resistanceRatio:0,

                            // prevButton:'.arrowLeft',
                            // nextButton:'.arrowRight',
                            onTransitionStart: function (swiper) {
                                scope.changeStartCallBack(swiper.previousIndex, swiper.activeIndex);
                            },

                            onTransitionEnd: function (swiper) {
                                scope.changeEndCallBack(swiper.previousIndex, swiper.activeIndex);
                            },
                        });
                    }

                });
            },
        };
    }
);
