
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('ShareController', ShareController);

function ShareController(loading, $stateParams, FindService, ErrorService) {
    var vm = this;
    vm.id = $stateParams.id;

    init();
    function init() {

        loading.hide('demos');

        var sendData = {
            proSetId: vm.id
        }

        FindService.getProjectColumn(sendData)
            .then(function temp(response) {
                vm.responseColumn = angular.copy(response.data);
                document.title = response.data.proSetName;
                vm.type = response.data.type;
                initWeixin(response.data);
            })
            .catch(error);

        var sendDataList = {
            proSetId: vm.id,
            pageSize: 3
        }

        FindService.getProjectList(sendDataList)
            .then(function temp(response) {
                vm.responseDetail = angular.copy(response.data.data.cells);
                vm.totalCount = angular.copy(response.data.data.totalCount);
            })
            .catch(error);
    }

    function initWeixin(data) {
        document.title = data.name;
        window.WEIXINSHARE = {
            shareTitle: data.proSetName,
            shareUrl: window.location.href,
            shareImg: data.sharePic || vm.shareImgSave  || 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png',
            shareDesc: '来「36氪创投助手」，发现最新最热优质项目！'
        };
        var obj = {};
        obj.timelineSuccess = function timelineSuccess() {
            krtracker('trackEvent', 'click', 'find.share.' + vm.type +  '.shareTimeline');
        };

        obj.appMessageSuccess = function appMessageSuccess() {
            krtracker('trackEvent', 'click', 'find.share.' + vm.type +  '.shareAppMessage');
        };

        window.InitWeixin(obj);
    }

    function error(err) {
        ErrorService.alert(err);
    }

}
