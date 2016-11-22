
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('LoginSuccessController', LoginSuccessController);

function LoginSuccessController() {
    init();
    function init() {
        window.parent.closeLoginModal();
    }

}
