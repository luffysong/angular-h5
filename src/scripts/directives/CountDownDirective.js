/**
 * Directive Name: countdown
 */

var angular = require('angular');
angular.module('defaultApp.directive').directive('countdown', [
    '$interval',
    function ($interval) {
        return {
            restrict: 'A',
            scope: { date: '@' },
            link: function (scope, element) {
                function toDhms(t) {
                    var days, hours, minutes, seconds, result = [];
                    days = Math.floor(t / 86400);
                    t -= days * 86400;
                    hours = Math.floor(t / 3600) % 24;
                    t -= hours * 3600;
                    minutes = Math.floor(t / 60) % 60;
                    t -= minutes * 60;
                    seconds = t % 60;

                    hours += days * 24;

                    result.push((Math.abs(hours ) < 10 ? ('0' + hours) : hours) + ' 小时 ');
                    result.push((Math.abs(minutes) < 10 ? ('0' + minutes) : minutes) + ' 分 ');
                    result.push((Math.abs(seconds) < 10 ? ('0' + seconds) : seconds) + ' 秒 ');

                    return result.join('');
                }

                var future = new Date(scope.date.replace('-', '/'));
                $interval(function () {
                    var diff = Math.floor((future.getTime() - new Date().getTime()) / 1000);
                    return element.text(toDhms(diff));
                }, 1000);
            }
        };
    }
]);
