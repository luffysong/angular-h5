/**
 * Directive Name: baiduBtn
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('transformHtml', [
    '$location','$timeout',
    function ($location,$timeout) {
        return {
            restrict: 'AE',
            scope:{
              html:"=transformHtml",
                color:"@pointColor"
            },
            link: function (scope, element, attrs) {
                scope.$watch("html",function(from){
                    if(from){
                        if(scope.color){
                            from = "<span class='point white'></span>&nbsp;"+from;
                            element.html(from.replace(/\n/g,"<br /><span class='point white'></span>&nbsp;"));
                        }else{
                            from = "<span class='point'></span>&nbsp;"+from;
                            element.html(from.replace(/\n/g,"<br /><span class='point'></span>&nbsp;"));
                        }
                    }
                });

            }
        };
    }
]);;
