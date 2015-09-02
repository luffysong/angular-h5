/**
 * Controller Name: MyCompanyController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('MyCompanyController',
    function($scope, $rootScope, $state, $stateParams, $location, $modal, CompanyService, UserService, DictionaryService, $http, ErrorService, $timeout) {
        $scope.uid = UserService.getUID();
        $scope.stateParams = $stateParams;
        $scope.myCompanyList = {
            data: [],
            selectedCompanyId: ''
        }
        myCompanyListShow = true;
        $scope.loadUserBasicData = function() {
            CompanyService.getManaged({}, function(data) {
                $scope.myCompanyList.data = data.data;
                myCompanyListShow = false;
            }, function(err) {
                ErrorService.alert(err);
                myCompanyListShow = false;
            });
        }
        $scope.loadUserBasicData();

        $scope.submitForm = function(e) {
            e && e.preventDefault();
            console.log($stateParams);
            $scope.applyForm = angular.element($("[name='applyForm']")).scope()["applyForm"];
            Object.keys($scope.applyForm).forEach(function(key){
                if($scope.applyForm[key]&&$scope.applyForm[key].$setDirty){
                    $scope.applyForm[key].$setDirty();
                }
            });

            if($scope.submiting || $scope.applyForm.$invalid){
                return;
            }

            $scope.submiting = true;

            CompanyService.ventureApply($scope.myCompanyList.selectedCompanyId, {
                type: $stateParams.type
            }, function(data) {
                if(data.company) {
                    // $state.go(finacingSuccess({type: 'list', cid: $scope.myCompanyList.selectedCompanyId}));
                    $state.go('finacingSuccess', {type: $stateParams.type, cid: $scope.myCompanyList.selectedCompanyId});
                } else {
                    // $state.go(finacingSuccess({type: 'accept', cid: $scope.myCompanyList.selectedCompanyId}));
                    $state.go('finacingSuccess', {type: $stateParams.type});
                }
                
            })
        }
    }
);