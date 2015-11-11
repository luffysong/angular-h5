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
                    e.preventDefault();
                    if(!UserService.getUID()){
                        e.preventDefault();
                        setTimeout(function(){
                            location.href = '/user/login?from=' + encodeURIComponent(location.href);
                        }, 300);
                    } else {
                        UserService.getIdentity(function(data) {
                            if(data.code == 4031) {
                                e.preventDefault();
                                $state.go('guide.welcome', {
                                    type: 'investorValidate'
                                });
                                return;
                            } else if(!data || !data.coInvestor) {
                                e.preventDefault();
                                $state.go("investorValidate");
                                return;
                            } else {
                                $state.go("syndicatesAllOrder");
                            }
                        });
                    }
                });
            }
        };
    }
]);
