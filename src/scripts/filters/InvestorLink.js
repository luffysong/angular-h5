/**
 * Filter Name: InvestorLink
 */

var angular = require('angular');

angular.module('defaultApp.filter').filter('investorLink', function () {
    return function (input,idKey,typeKey) {
        var userLink = 'user_detail({id:"{{id}}"})';
        var companyLink = 'company_detail({id:"{{id}}"})';
        var orgLink = 'organization_detail({id:"{{id}}"})';

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
        /*机构页未完成，当投资主体为机构时，链接置空*/
        if(input[typeKey] == "ORGANIZATION" || input[typeKey] == 2){
            return "index";
        }else {
            return input[typeKey]?types[input[typeKey]].replace('{{id}}',input[idKey]):"index";
        }
    };
});
