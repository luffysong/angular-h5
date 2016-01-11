/**
 * Controller Name: MyCompanyController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('MyCompanyController',
    function($scope, $rootScope, $state, $stateParams, loading, $location, $modal, CompanyService, UserService, DictionaryService, $http, ErrorService, $timeout) {
        $scope.uid = UserService.getUID();
        $scope.stateParams = $stateParams;
        $scope.myCompanyList = {
            data: [],
            selectedCompanyId: '',
        };

        // 返回上一页
        $scope.goBack = function(e) {
            e && e.preventDefault();
            history.go(-1);
        };

        loading.show('myCompanyListShow');
        $scope.loadUserBasicData = function() {
            CompanyService.getManaged({}, function(data) {
                $scope.myCompanyList.data = data.data;
                $.each(data.data, function(i, val) {
                    data.data[i].checkStatus = false;
                });

                loading.hide('myCompanyListShow');
            }, function(err) {

                ErrorService.alert(err);
                loading.hide('myCompanyListShow');
            });
        };

        $scope.loadUserBasicData();

        $scope.btnRadio = function(e, index, id) {
            e && e.preventDefault();
            $.each($scope.myCompanyList.data, function(i, val) {
                val.checkStatus = false;
            });

            if (id) {
                $scope.myCompanyList.data[index].checkStatus = true;
                $scope.myCompanyList.selectedCompanyId = id;
            } else {
                $scope.myCompanyList.data[index].checkStatus = false;
                $scope.myCompanyList.selectedCompanyId = '';
            }
        };

        $scope.submitForm = function(e) {
            e && e.preventDefault();
            console.log($stateParams);
            $scope.applyForm = angular.element($("[name='applyForm']")).scope()['applyForm'];
            Object.keys($scope.applyForm).forEach(function(key) {
                if ($scope.applyForm[key] && $scope.applyForm[key].$setDirty) {
                    $scope.applyForm[key].$setDirty();
                }
            });

            if ($scope.submiting || $scope.applyForm.$invalid) {
                return;
            }

            $scope.submiting = true;

            CompanyService.ventureApply($scope.myCompanyList.selectedCompanyId, {
                type: $stateParams.from,
            }, function(data) {
                $state.go('finacingSuccess', { from: $stateParams.from, cid: $scope.myCompanyList.selectedCompanyId });

                // if(data.company) {
                //     // $state.go(finacingSuccess({type: 'list', cid: $scope.myCompanyList.selectedCompanyId}));
                //     $state.go('finacingSuccess', {from: $stateParams.from, cid: $scope.myCompanyList.selectedCompanyId});
                // } else {
                //     // $state.go(finacingSuccess({type: 'accept', cid: $scope.myCompanyList.selectedCompanyId}));
                //     $state.go('finacingSuccess', {from: $stateParams.from});
                // }

            });
        };
    }
);
