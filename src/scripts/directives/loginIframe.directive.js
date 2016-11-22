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
            scope.loginSrc = $sce.trustAsResourceUrl(window.LOGIN_HOST + '/pages/?ok_url=' +
                encodeURIComponent(location.href.replace(/\/[^\/]*?$/, '/findInvestor?ktm_source=' + window.ktm_source)) +
                '&theme=' + encodeURIComponent(window.LOGIN_CSS) + '#/login-simple');

        }

    };

}

