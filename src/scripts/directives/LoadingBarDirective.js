/**
 * Directive Name: baiduBtn
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('loadingBar', [
    '$location','$timeout',
    function ($location,$timeout) {
        return {
            restrict: 'AE',
            scope:{
              percent:"=percent",
              loadingTip:"=loadingTip"
            },
            template:'<div class="loading-shade"><div class="loading-bar"></div></div>',
            link: function (scope, element, attrs) {
                scope.$watch('percent', function(percent){
                    if(percent){
                        scope.percent = Math.min(scope.percent, 100);
                        if(element.find(".loading-bar")){
                            if(scope.loadingTip){
                                var i = parseInt(scope.loadingTip) >= 10000 ? parseInt(scope.loadingTip) / 10000 +"万" : parseInt(scope.loadingTip);
                                i = "￥"+i;
                                element.find(".loading-shade").append("<div class='loading-tip'>已筹集："+i+"<i class='bubble'></i><i class='pop'></i></div>");
                            }
                            element.find(".loading-bar").each(function(){
                                $(this).width(scope.percent + "%");
                            });
                        }else {
                            console.log("loading-bar not found");
                        }
                    }
                });
            }
        };
    }
]);;