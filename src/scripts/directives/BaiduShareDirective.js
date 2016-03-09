/**
 * Directive Name: baiduBtn
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('baiduShare', [
    function () {
        return {
            restrict: 'AE',
            scope:{
                shareDetail:'=baiduShare',
                shareWay:'@shareWay'
            },
            link: function (scope, element) {
                var href = '';
                scope.$watch('shareDetail', function (from) {
                    if (!from) {
                        return;
                    }

                    if (scope.shareWay === 'sqq') {
                        href = 'http://connect.qq.com/widget/shareqq/index.html?url=' + from.url + '&title=' + from.title + '&desc=' + from.desc;
                    }else if (scope.shareWay === 'tsina') {
                        href = 'http://share.baidu.com/s?to=tsina&url=' + from.url + '&title=' + from.desc;
                    }else if (scope.shareWay === 'mail') {
                        href = 'mailto:?subject=' + from.subject + '&body=' + from.body;
                    }

                    element.attr('href', href);
                }, true);
            }
        };
    }
]);
