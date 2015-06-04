/**
 * Directive Name: baiduBtn
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('baiduBtn', [
    '$location',
    function ($location) {
        return {
            restrict: 'AE',
            link: function (scope, element, attrs) {
                if(!attrs.baiduBtn)return;
                $(element).click(function(){
                    _hmt.push(['_trackEvent', '按钮', attrs.baiduBtn]);
                    krtracker('trackEvent', '按钮', attrs.baiduBtn);
                });

            }
        };
    }
]);;
