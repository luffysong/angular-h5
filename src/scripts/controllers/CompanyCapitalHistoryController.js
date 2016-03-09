/**
 * Controller Name: CompanyCapitalHistoryController
 */

var angular = require('angular');
angular.module('defaultApp.controller').controller('CompanyCapitalHistoryController',
    function ($scope, $location, $stateParams, $state, CompanyService) {
        $scope.companyId = $stateParams.id;
        $scope.fullCapital = true;
        $scope.title = '融资经历';
        $scope.finance = {};

        var INVESTOR_TYPE = {
            INDIVIDUAL: 'INDIVIDUAL',
            ORGANIZATION: 'ORGANIZATION',
            COMPANY: 'COMPANY'
        };

        var RONG_HOST = '//' + projectEnvConfig.rongHost;

        $scope.isOrganization = function (type) {
            return type === INVESTOR_TYPE.ORGANIZATION;
        };

        $scope.getUISref = function (type, id) {
            if (type === INVESTOR_TYPE.ORGANIZATION) {
                return RONG_HOST + '/organization/' + id;
            }else if (type === INVESTOR_TYPE.INDIVIDUAL) {
                return $state.href('user_detail', { id: id });
            }else {
                return $state.href('companyDetail', { id: id });
            }
        };

        CompanyService['past-finance'].query({
                id:$scope.companyId
            }, function (data) {
                $scope.finance.originListCount = data.data.length;
                $scope.finance.list = data.data;
            });
    });

