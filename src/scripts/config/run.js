angular.module('defaultApp')
    .run(function($rootScope){
        $rootScope.REGEXP = $rootScope.REGEXP || {};
        $rootScope.REGEXP.phone = /^1\d{10}$/;
    })
    .run(function ($http, $rootScope,notify) {
    	notify.config({
            templateUrl: 'templates/angular-notify.html'
        });
    });


