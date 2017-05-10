var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('NewsDetailController', NewsDetailController);

function NewsDetailController(FindService, ErrorService, loading, $stateParams, hybrid) {
    var vm = this;
    vm.news = {
        id: $stateParams.id || 0,
        investors: 0,
        amount: 0,
        data: {}
    };

    if($stateParams.ccid) {
        hybrid.open('addBottomViewInWeb/' + $stateParams.ccid);
    }
    if($stateParams.investors) {
        vm.news.investors = decodeURIComponent($stateParams.investors);
    }
    if($stateParams.amount) {
        vm.news.amount = decodeURIComponent($stateParams.amount);
    }

    FindService.getNewsDetail(vm.news.id).then(function (data) {
        loading.hide('newsDetailLoading');
        if (data && data.data && data.data) {
            vm.news.data = data.data;
            //vm.news.data.ts = moment(vm.news.data.ts).format('YYYY年MM月DD日');
            vm.news.data.ts = moment(vm.news.data.ts).format('YYYY-MM-DD HH:mm:ss').substring(5,16);
            document.title = vm.news.data.title;
        }
    }).catch(function (err) {
        loading.hide('newsDetailLoading');
        if (err && err.data) {
            ErrorService.alert(err.data);
        }
    });
}
