/**
 * Controller Name: syndicatesValidateController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('SyndicatesValidateController',
    function($scope, $state, $stateParams, $modal, notify, $timeout, loading, UserService, checkForm, ErrorService, DictionaryService, CoInvestorService) {
        document.title = "36氪股权投资";

        $timeout(function(){
            window.scroll(0,0);
        }, 0);

        loading.show("syndicatesValidate");

        $timeout(function() {
            loading.hide("syndicatesValidate");
        }, 500);

        $scope.uid = UserService.getUID();
        $scope.isLogin = !!UserService.getUID();

        $scope.investor = {
            "name": '',
            "id": '',
            "id-confirm": '',
            "email": '',
            "phone": '',
            "captcha": '',
            "company": '',
            "work": '',
            "address": '',
            "condition": ''
        };

        $scope.submitForm = function() {
            if(!checkForm('syndicatesValidateForm')) return;
        };

        /*查看风险揭示书*/
        $scope.seeRisk = function(){
            $modal.open({
                templateUrl: 'templates/company/pop-risk-tip-all.html',
                windowClass: 'remind-modal-window',
                controller: [
                    '$scope', '$modalInstance','scope',
                    function ($scope, $modalInstance, scope) {
                        $scope.ok = function(){
                            $modalInstance.dismiss();
                        }
                    }
                ],
                resolve: {
                    scope: function(){
                        return $scope;
                    }
                }
            });
        };

        /*查看用户服务协议*/
        $scope.seeProtocol = function () {
            $modal.open({
                templateUrl: 'templates/company/pop-service-protocol.html',
                windowClass: 'remind-modal-window',
                controller: [
                    '$scope', '$modalInstance','scope',
                    function ($scope, $modalInstance, scope) {
                        $scope.ok = function(){
                            $modalInstance.dismiss();
                        }
                    }
                ],
                resolve: {
                    scope: function(){
                        return $scope;
                    }
                }
            });
        };
    });
