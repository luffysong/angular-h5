/**
 * Directive Name: countdown
 */

var angular = require('angular');
angular.module('defaultApp.directive').directive('countdown', [
    '$interval',
    function($interval) {
        return {
            restrict: 'A',
            scope: {
                date: '@',
                openDate: '@'
            },
            link: function(scope, element) {
                function toDhms(t) {
                    var hours;
                    var minutes;
                    var seconds;
                    var result = [];
                    hours = Math.floor(t / 3600);
                    t -= hours * 3600;
                    minutes = Math.floor(t / 60) % 60;
                    t -= minutes * 60;
                    seconds = t % 60;

                    result.push((Math.abs(hours) < 10 ? ('0' + hours) : hours) + ' 小时 ');
                    result.push((Math.abs(minutes) < 10 ? ('0' + minutes) : minutes) + ' 分 ');
                    result.push((Math.abs(seconds) < 10 ? ('0' + seconds) : seconds) + ' 秒 ');

                    return result.join('');
                }

                var before = new Date(scope.openDate.replace(/-/g, '/'));
                var future = new Date(scope.date.replace(/-/g, '/'));
                $interval(function() {
                    var diff = Math.floor((future.getTime() - new Date().getTime()) / 1000);

                    if (diff <= 0) {
                        var days = Math.floor((future.getTime() - before.getTime()) / (1000 * 60 * 60 * 24));
                        return element.text('未在' + days + '天内付款');
                    } else {
                        return element.text(toDhms(diff));
                    }
                }, 1000);
            }
        };
    }
]);
