
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('RoadShowController', RoadShowController);

function RoadShowController(loading) {
    var vm = this;

    init();
    function init() {
        console.log('test');
        loading.hide('demos');
    }

}
