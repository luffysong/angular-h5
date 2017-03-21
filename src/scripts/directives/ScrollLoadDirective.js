/**
 * Directive Name: scrollLoad
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('scrollLoad', [
    '$location',
    function () {
        return {
            restrict: 'AE',
            scope: {
                loadCallback: '=loadCallback',
                boundary: '=boundary',
                scrollParent: '=scrollParent'
            },
            link: function (scope, element) {
                var scrollParent = $(scope.scrollParent || window);
                var boundary = scope.boundary || 30;
                scrollParent.scroll(function () {
                    var top = scrollParent.scrollTop();
                    var height = scrollParent.height();
                    var scrollBottom = $(element).offset().top - top - height;
                    var isOutBoundary =  scrollBottom <= boundary;

                    if (isOutBoundary) {
                        scope.loadCallback && scope.loadCallback();
                    }
                });
            }
        };
    }
]);
