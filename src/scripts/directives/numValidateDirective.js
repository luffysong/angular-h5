/**
 * Directive Name: fillUrl
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('numValidate',
    function ($location) {
        return {
            restrict: 'AE',
            require: 'ngModel',
            scope:{
                title:"@numValidate"
            },
            link: function (scope, element, attrs, ctrl) {
                ctrl.$parsers.unshift(function(val){
                    if(val != ""){
                        if(/^\d*$/.test(val)){
                            ctrl.$setValidity("notNumber",true);
                        }else{
                            ctrl.$setValidity("notNumber",false);
                        }
                    }else{
                        ctrl.$setValidity("notNumber",true);
                    }
                    return val;
                });
            }
        };
    }
);
