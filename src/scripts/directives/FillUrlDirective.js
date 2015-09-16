/**
 * Directive Name: fillUrl
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('fillUrl',
    function ($location) {
        return {
            restrict: 'AE',
            require: '^?form',
            link: function (scope, element, attrs, formCtrl) {
                if(!attrs.ngModel){
                    return;
                }
                element.bind('focus', function(){
                    setTimeout(function(){
                        var val = scope.$eval(attrs.ngModel);
                        if(!val){
                            scope.$apply(function(){
                                scope.$eval(attrs.ngModel+"='http://'");
                                formCtrl[element.attr('name')].$setPristine();
                            });
                        }
                    },0);
                });
                element.bind('blur', function(){
                    setTimeout(function(){
                        var val = scope.$eval(attrs.ngModel);
                        if(val=='http://'){
                            scope.$apply(function(){
                                scope.$eval(attrs.ngModel+"=''");
                                formCtrl[element.attr('name')].$setPristine();
                            });
                        }
                    },0);

                });
            }
        };
    }
);
