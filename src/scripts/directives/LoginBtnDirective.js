/**
 * Directive Name: loginBtn
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('loginBtn', [
    '$location','UserService',
    function ($location,UserService) {
        return {
            restrict: 'AE',
            link: function (scope, element, attrs) {
                element.click(function(e){


                    if(UserService.getUID())return;

                    if(window._hmt){
                        _hmt.push(['_trackPageview', "/user/login##fromUser=0"]);
                        krtracker('trackPageView', '/user/login');
                    }

                    e.preventDefault();

                    setTimeout(function(){
                        location.href = '/user/login?from=' + encodeURIComponent(attrs.loginBtn || location.href);
                    }, 300);
                });
            }
        };
    }
]);;
