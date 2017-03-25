var angular = require('angular');
angular.module('defaultApp.controller')
    .controller('ProjectAlbumController', ProjectAlbumController);

function ProjectAlbumController(loading, ErrorService, FindService, $stateParams, $state) {
    var vm = this;
    // URL 参数
    vm.params = {
        type: $stateParams.type,
    };
    // 页面 title
    switch(vm.params.type) {
        case 'rong':
            document.title = '机构在融';
            break;
        case 'hunting':
            document.title = 'HUNTING+';
            break;
        case 'timer':
            document.title = '限时首发';
            break;
    }
}
