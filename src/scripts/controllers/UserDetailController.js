/**
 * Controller Name: UserDetailController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('UserDetailController', [
    '$scope', '$location', '$stateParams', '$state', 'UserService',
    function($scope, $location, $stateParams, $state, UserService) {
    	// 获取用户详情信息
        $scope.user = {
            // investCasesLimit: 3
        };

        UserService.basic.get({id: $stateParams.id}, function (response) {
            document.title=response.name + " | 36氪融资";
            angular.extend($scope.user, response);
            // 默认显示 4 个
            if ($scope.user.orgMoneyUnit == "USD") {
                $scope.orgunit_type = "$"
            } else if($scope.user.orgMoneyUnit == "CNY") {
                $scope.orgunit_type = "￥"
            }
            if ($scope.user.investMoneyUnit == "USD") {
                $scope.personunit_type = "$"
            } else if($scope.user.investMoneyUnit == "CNY"){
                $scope.personunit_type = "￥"
            }
        });

        //投资信息，投资经历
        UserService.finacing.query({
            id: $stateParams.id
        }, function (response) {
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


