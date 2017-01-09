/**
 * Directive Name: loginIframe
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('loginIframe', loginIframe);

function loginIframe($sce) {
    return {

        template: '<iframe frameborder="0" ng-src="{{loginSrc}}" ' +
        'onload="this.style.opacity=1" ' +
        'style="opacity: 0; transition:all 0.6s;width: 100%;height: 100%"></iframe>',
        restrict: 'AE',
        scope: {

        },
        link: function (scope) {
            if (window.TYPE === 'startup') {
                scope.loginSrc = $sce.trustAsResourceUrl(window.LOGIN_HOST + '/pages/?ok_url=' +
                  encodeURIComponent(location.href.replace(/\/[^\/]*?$/, '/findStartUp?activityName=' + window.activityName)) +
                  '&theme=' + encodeURIComponent(window.LOGIN_CSS) + '#/login-simple');
            } else if (window.TYPE === 'investor') {
                scope.loginSrc = $sce.trustAsResourceUrl(window.LOGIN_HOST + '/pages/?ok_url=' +
                encodeURIComponent(location.href.replace(/\/[^\/]*?$/, '/frInvestor?activityName=' + window.activityName)) +
                '&theme=' + encodeURIComponent(window.LOGIN_CSS) + '#/login-simple');
            } else {
                scope.loginSrc = $sce.trustAsResourceUrl(window.LOGIN_HOST + '/pages/?ok_url=' +
                  encodeURIComponent(location.href.replace(/\/[^\/]*?$/, '/findInvestor?activityName=' + window.activityName)) +
                  '&theme=' + encodeURIComponent(window.LOGIN_CSS) + '#/login-simple');
            }

        }

    };

}
