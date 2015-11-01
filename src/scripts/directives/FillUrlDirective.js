/**
 * Directive Name: fillUrl
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('fillUrl',
    function ($location, DictionaryService) {
        var urlArr = DictionaryService.getDict('CompanyUrlBlacklist');
        return {
            restrict: 'AE',
            require: '^?form',
            link: function (scope, element, attrs, formCtrl) {
                if(!attrs.ngModel){
                    return;
                }
                scope.$watch(attrs.ngModel, function(){
                    if(scope.$eval(attrs.ngModel) == ''){
                        formCtrl[element.attr('name')].$setPristine();
                    }
                })
                element.bind('focus', function(){
                    formCtrl[element.attr('name')].$setValidity('urlblacklist', true);
                    var val = scope.$eval(attrs.ngModel);
                    if(!val){
                        setTimeout(function(){
                            scope.$apply(function(){
                                scope.$eval(attrs.ngModel+"='http://'");
                            })
                        },0)
                    }
                });
                element.bind('blur', function(){
                    setTimeout(function(){
                        var val = scope.$eval(attrs.ngModel);
                        if(!val) return;
                        if(val=='http://'){
                            scope.$apply(function(){
                                scope.$eval(attrs.ngModel+"=''");
                                formCtrl[element.attr('name')].$setPristine();
                            });
                        }
                        for (var i = 0; i < urlArr.length; i++){
                            if(val.indexOf(urlArr[i]) > -1 ){
                                scope.$apply(function(){
                                    formCtrl[element.attr('name')].$setValidity('urlblacklist', false);
                                });
                                break;
                            }
                        }
                    },0);

                });
            }
        };
    }
);
