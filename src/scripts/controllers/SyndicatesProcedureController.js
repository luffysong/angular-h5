var angular = require('angular');

angular.module('defaultApp.controller').controller('SyndicatesProcedureController', [
    '$scope', '$state', 'notify', '$stateParams', 'CrowdFundingService', 'ErrorService',
    function($scope,  $state, notify, $stateParams, CrowdFundingService, ErrorService) {
        //处理参数
        $scope.params = {};
        $scope.params.cfid = $stateParams.cfid || 0;

        if(!$scope.params.cfid) {
            return $state.go('syndicatesAllOrder');
        }

        // 手续进度详情
        $scope.formality = {};
        CrowdFundingService.query({
            'model': 'crowd-funding',
            'id': $scope.params.cfid,
            'submodel': 'formality'
        }, function(data) {
            $scope.formality = data;
            var updateDate = moment(data.updated_at);
            var durationArr = [2, 7, 27, 29];
            var durationForeignArr = [2, 7, 107, 109];
            if(data.status >= 2 && data.status <= 6) {
                 $scope.formality.forecast_complete_time = updateDate.add(data.capital_type == 1 ? durationArr[data.status - 2] : durationForeignArr[data.status - 2], 'days').format('YYYY年MM月DD日');
            }
        }, function(err) {
            ErrorService.alert(err);
        });
    }
]);
