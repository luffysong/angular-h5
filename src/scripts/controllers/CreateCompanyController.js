var angular = require('angular');

angular.module('defaultApp.controller').controller('CreateCompanyController',['$modal', '$scope', function($modal, $scope){

    $scope.createTip = function(){
        $modal.open({
            templateUrl: 'templates/company/create_tip.html',
            windowClass:'pop_create_tip_wrap',
            controller:[
                '$scope',
                '$modalInstance',
                'scope',
                function($scope, $modalInstance, scope){
                    $scope.ok = function(){
                        $modalInstance.dismiss();
                    }
                }
            ],
            resolve:{
                scope:function(){
                    return $scope;
                }
            }

        });
    }


}])

