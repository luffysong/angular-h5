
var angular = require('angular');
angular.module('defaultApp.service').service('hybrid', function () {

    this.isInApp = !!navigator.userAgent.match(/36kr/) || window.isAppAgent;
    this.openProject = openProject;
    this.open = open;

    function call(url) { //定义startApp函数
        var ifr = document.createElement('iframe');
        ifr.src = url;
        ifr.style.display = 'none';
        document.body.appendChild(ifr);
        window.setTimeout(function () {
            document.body.removeChild(ifr);
            ifr = null;
        }, 200);
    }

    function buildUrl(path) {
        return 'krtou:/' + path;
    }

    function open(path) {
        call(buildUrl(path));
    }

    function openProject(id) {
        call(buildUrl('/company/' + id));
    }
});
