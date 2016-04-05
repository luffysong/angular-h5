/**
 * Controller Name: UserDetailController
 */

// jscs:disable  requireCamelCaseOrUpperCaseIdentifiers
var angular = require('angular');

angular.module('defaultApp.controller').controller('UserDetailController', [
    '$scope', '$location', '$stateParams', '$state', 'UserService', '$timeout',
    function ($scope, $location, $stateParams, $state, UserService, $timeout) {
        $timeout(function () {
            window.scroll(0, 0);
        }, 0);

        // 获取用户详情信息
        $scope.user = {
            // investCasesLimit: 3
        };

        UserService.basic.get({ id: $stateParams.id }, function (response) {

            document.title = response.name + '的创投名片 | 36氪';
            window.WEIXINSHARE = {
                shareTitle: response.name + '的创投名片 | 36氪',
                shareDesc: response.intro || response.name,
                shareImg: response.avatar || 'http://img.36tr.com/logo/20140520/537aecb26e02d'
            };
            window.InitWeixin();

            angular.extend($scope.user, response);

            // 默认显示 4 个
            if ($scope.user.orgMoneyUnit === 'USD') {
                $scope.orgunit_type = '$';
            } else if ($scope.user.orgMoneyUnit === 'CNY') {
                $scope.orgunit_type = '￥';
            }

            if ($scope.user.investMoneyUnit === 'USD') {
                $scope.personunit_type = '$';
            } else if ($scope.user.investMoneyUnit === 'CNY') {
                $scope.personunit_type = '￥';
            }
        });

        //投资信息，投资经历
        UserService.getInvestCases(
           $stateParams.id,
        function (response) {
            $scope.user.invest_cases = response.data;
        });

        // 创业经历
        $scope.user.investCasesLimit = 2;

        //获取创业经历
        $scope.user.founderLimit = 2;
        UserService.company.query({
            id: $stateParams.id
        }, function (response) {
            $scope.user.founder_cases = response.expList;

        });

        // 工作经历
        $scope.user.workedLimit = 2;
        UserService.work.query({
            id: $stateParams.id
        }, function (response) {
            $scope.user.worked_cases = response.expList;
        });
    }
]);

