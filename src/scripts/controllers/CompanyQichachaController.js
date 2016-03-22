/**
 * Controller Name: CompanyQichachaController
 */

var angular = require('angular');
angular.module('defaultApp.controller').controller('CompanyQichachaController',
    function ($scope, $location, $stateParams, $state, CompanyService) {
        $scope.companyId = $stateParams.id;
        $scope.fullCapital = true;
        var QI_CHA_CHA = 'http://www.qixin.com/company/';
        CompanyService.qichacha.get({
                id:$scope.companyId
            }, function (data) {
                setQichacha(data);
            });

        var meta = [{
                name:'公司全称：',
                key:'Name'
            }, {
                name:'法定代表：',
                key:'OperName'
            }, {
                name:'注册资本：',
                key:'RegistCapi'
            }, {
                name:'注册日期：',
                key:'TermStart'
            }];

        function setQichacha(data) {
                $scope.moreHref = QI_CHA_CHA + data.id + '?from=36kr';
                $scope.qichachaList = [];
                for (var i = 0, l = meta.length; i < l; i++) {
                    var pair = meta[i];
                    $scope.qichachaList.push({
                        name:pair.name,
                        value:data[pair.key]
                    });
                }
            }
    });
