var $ = require('jquery');
var angular = require('angular');

require('./config/setting');
require('./config/dictionary');
require('./config/dictionary_cf');

require('./config/city');

angular.module('ui.carousel', ['ui.bootstrap']);
// angular.module('ui.modal', ['ui.bootstrap.pagination', 'ui.bootstrap.modal', 'ui.bootstrap.tpls','ui.bootstrap.tooltip','ui.bootstrap.rating']);


angular.module('defaultApp.filter', []);
angular.module('defaultApp.directive', []);
angular.module('defaultApp.service', ['ngResource']);
angular.module('defaultApp.controller', []);
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
    'highcharts-ng'
];

if(window.MOCKMODE_ON){
    depModules.push('defaultApp.mocks')
}

angular.module('defaultApp', depModules);
require('./config/constant');
require('./config/routes');
require('./config/run');




// 启动
$(document).ready(function () {
    console.log("test1");
    if(navigator.userAgent.match(/36kr/) && location.hash.indexOf('zhongchou')>-1){
        console.log("test");
        location.href = 'http://'+projectEnvConfig.helpHost+'/q-zc-helper.html';
        return;
    }
  angular.bootstrap(document, ['defaultApp']);
});
