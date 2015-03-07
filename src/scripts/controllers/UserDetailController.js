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
            angular.extend($scope.user, response);
            console.log(response);
            // 默认显示 4 个
            if ($scope.user.orgMoneyUnit == "USD") {
                $scope.orgunit_type = "$"
            } else if($scope.user.investMoneyUnit == "CNY") {
                $scope.orgunit_type = "￥"
            }
            if ($scope.user.investMoneyUnit == "USD") {
                $scope.personunit_type = "$"
            } else if($scope.user.orgMoneyUnit == "CNY"){
                $scope.personunit_type = "￥"
            }
        });
    }
]);