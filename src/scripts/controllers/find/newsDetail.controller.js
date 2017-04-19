var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('NewsDetailController', NewsDetailController);

function NewsDetailController(FindService, ErrorService, loading, $stateParams) {
    var vm = this;
    vm.news = {
        id: $stateParams.id || 0,
        content: ''
    };

    FindService.getNewsDetail(vm.news.id).then(function (data) {
        loading.hide('newsDetailLoading');
        if (data && data.data && data.data.content) {
            vm.news.content = data.data.content;
        }
    }).catch(function (err) {
        loading.hide('newsDetailLoading');
        if (err && err.data) {
            ErrorService.alert(err.data);
        }
    });
}
