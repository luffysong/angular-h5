var angular = require('angular');

require('./bootstrap/setting');
require('./config/dictionary');
require('./config/dictionary_cf');
require('./config/dictionary_url');

require('./config/city');

angular.module('ui.carousel', ['ui.bootstrap']);

// angular.module('ui.modal', ['ui.bootstrap.pagination', 'ui.bootstrap.modal', 'ui.bootstrap.tpls','ui.bootstrap.tooltip','ui.bootstrap.rating']);

angular.module('defaultApp.filter', []);
angular.module('defaultApp.directive', []);
angular.module('defaultApp.service', ['ngResource']);
angular.module('defaultApp.controller', ['ngTouch', 'MassAutoComplete', 'checklist-model']);
angular.module('templates', []);

require('./filters');
require('./directives');
require('./services');
require('./controllers');
/*##require('./templates')##*/

var depModules = [

    // 'ngAnimate',
    'ngSanitize',
    'ngTouch',
    'ngCookies',
    'ui.router',
    'ui.carousel',
    'defaultApp.filter',
    'defaultApp.directive',
    'defaultApp.service',
    'defaultApp.controller',
    'templates',
    'monospaced.qrcode',
    'angularFileUpload',
    'cgNotify',
    'slick',
    'highcharts-ng',
    'MassAutoComplete',
    'permission',
    'infinite-scroll',
    'duScroll'
];

if (window.MOCKMODE_ON) {
    depModules.push('defaultApp.mocks');
}

angular.module('defaultApp', depModules);
require('./config/constant');
require('./bootstrap/routes');
require('./bootstrap/run');

// 启动
$(document).ready(function () {
    //if(navigator.userAgent.match(/36kr/) && location.hash.indexOf('zhongchou')>-1){
    //    console.log("test");
    //    location.href = 'http://'+projectEnvConfig.helpHost+'/q-zc-helper.html';
    //    return;
    //}
    angular.bootstrap(document, ['defaultApp']);
});
