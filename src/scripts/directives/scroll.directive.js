/**
 * Directive Name: baiduBtn
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('scroll', [
    '$location', '$timeout',
    function () {
        return {
            restrict: 'AE',
            scope:{
                callback: '&'
            },
            link: function (scope) {
                //判断 上滚还是下滚
                function scroll(fn) {
                    var beforeScrollTop = $('#contentScroll')[0].scrollTop;
                    fn = fn || function () {};

                    $('#contentScroll')[0].addEventListener('scroll', function () {
                        var afterScrollTop = this.scrollTop;
                        var delta = afterScrollTop - beforeScrollTop;

                        //console.log(delta);
                        if (delta === 0) return false;
                        fn(delta);
                        beforeScrollTop = afterScrollTop;
                    }, false);
                }

                scope.$watch('scroll', function () {
                    scroll(function (direction) {

                        if (direction < 0) { //上滚
                            scope.callback({ args: 'up' });
                        }else {//下滚
                            scope.callback({ args: 'down' });
                        }
                    });
                });

            }
        };
    }
]);
