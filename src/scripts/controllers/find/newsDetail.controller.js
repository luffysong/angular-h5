var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('NewsDetailController', NewsDetailController);

function NewsDetailController(FindService, ErrorService, UserService, CredentialService, loading, $stateParams, hybrid) {
    var vm = this;
    vm.sendData = {
        reportId: $stateParams.id || 0,
        type: 'opportunity',
        investmentId: $stateParams.investmentId || 0
    };
    console.log($stateParams);
    vm.news = {
        id: $stateParams.id || 0,
        investors: '',
        amount: '',
        phase: '',
        data: {}
    };

    if($stateParams.ccid) {
        hybrid.open('addBottomViewInWeb/' + $stateParams.ccid);
    }
    // if($stateParams.investors) {
    //     vm.news.investors = decodeURIComponent($stateParams.investors);
    //     var investorsArr = vm.news.investors.split('·');
    //     vm.news.investors = investorsArr.join('，');
    // }
    // if($stateParams.amount) {
    //     vm.news.amount = decodeURIComponent($stateParams.amount);
    // }
    // if($stateParams.phase) {
    //     vm.news.phase = decodeURIComponent($stateParams.phase);
    // }

    vm.mergerGoTo = mergerGoTo;
    // 三种类型并购方
    function mergerGoTo (id, type, event) {
      event.preventDefault();
      event.stopPropagation();
      if (id === 0) return;
      var path;
      if (type === 'INVESTOR') {
        path = 'investor/' + id;
      } else if (type === 'ORGANIZATION') {
        path = 'org/' + id;
      } else if (type === 'COMPANY') {
        path = 'crmCompany/' + id;
      }
      openNativePage(path, id, event);
    }
                
    function openNativePage(path, cid, event) {
        console.log(path);
        event && event.stopPropagation();
        if (!UserService.getUID()) {
            CredentialService.directToLogin();
        } else {
            hybrid.open(path);
        }
    }
    FindService.getNewsDetail(vm.sendData).then(function (data) {
    // FindService.getNewsDetail(vm.news.id).then(function (data) {
        loading.hide('newsDetailLoading');
        if (data && data.data && data.data) {
            vm.news.data = data.data;
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
