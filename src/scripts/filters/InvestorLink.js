/**
 * Filter Name: InvestorLink
 */

var angular = require('angular');

angular.module('defaultApp.filter').filter('investorLink', function () {
    return function (input,idKey,typeKey) {
        var userLink = 'users.overview({id:"{{id}}"})';
        var companyLink = 'companys.detail.overview({id:"{{id}}"})';
        var orgLink = 'organizations.overview({id:"{{id}}"})';

        var types = {
            "COMPANY":companyLink,
            "ORGANIZATION":orgLink,
            "INDIVIDUAL":userLink
        };

        if(!types[input[typeKey]]){
            types = {
                "2":orgLink,
                "3":companyLink
            };
        }

        return types[input[typeKey]].replace('{{id}}',input[idKey]);
    };
});
