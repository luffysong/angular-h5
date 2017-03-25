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
            vm.title = '机构在融';
            break;
        case 'hunting':
            document.title = 'HUNTING+';
            vm.title = 'HUNTING+';
            break;
        case 'timer':
            document.title = '限时首发';
            vm.title = '限时首发';
            break;
    }
    // 页面初始化
    loading.show('projectAlbumLoading');
    loading.hide('projectAlbumLoading');
    vm.text = "在多位业内人士看来，美图将上市地点选在中国香港，或与国内资本市场的上市门槛有关。由于美图公司尚未盈利，目前其投资公司的资金存续期也到了一定阶段。";
}
