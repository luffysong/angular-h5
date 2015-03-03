var $ = require('jquery');
var angular = require('angular');

require('./config/setting');
require('./config/dictionary');
require('./config/city');


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
    'ngAnimate',
    'ui.router',
    'defaultApp.filter',
    'defaultApp.directive',
    'defaultApp.service',
    'defaultApp.controller',
    'templates',
    'monospaced.qrcode'
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
  angular.bootstrap(document, ['defaultApp']);
});
