/**
 * Directive Name: orderBtn
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('orderBtn', [
    '$location','UserService', '$state',
    function ($location,UserService, $state) {
        return {
            restrict: 'AE',
            link: function (scope, element, attrs) {
                element.click(function(e){
                    if(!UserService.getUID()){
                        event.preventDefault();
                        setTimeout(function(){
                            location.href = '/user/login?from=' + encodeURIComponent(location.href);
                        }, 300);
                    } else {
                        UserService.getIdentity(function(data) {
                            if(data.code == 4031) {
                                event.preventDefault();
                                $state.go('guide.welcome', {
                                    type: 'investorValidate'
                                });
                            } else if(!data || !data.coInvestor) {
                                if(event){
                                    event.preventDefault();
                                }
                                $state.go("investorValidate");
                            }
                        });
                    }
                });
            }
        };
    }
]);
