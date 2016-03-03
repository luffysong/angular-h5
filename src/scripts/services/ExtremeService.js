/**
 * Service Name: ExtremeService
 */

var angular = require('angular');

angular.module('defaultApp.service').service('ExtremeSerivce',
	function ($location, BasicService) {

    var BASE_URL = '/api/bpdeliver/:id/:sub/:subid';
    var service = BasicService(BASE_URL, {
            save:{
                method: 'POST',
                transformRequest: BasicService.jqParams()
            }, update:{
                method: 'PUT',
                transformRequest: BasicService.jqParams()
            }, get:{
                method: 'GET',
                transformResponse: BasicService.makeResponseConverter(function (data) {
                    var convertObj = data.data;
                    var originRef = data;
                    data = data.data;
                    convertObj.domains = data.industryList;
                    convertObj.start = new Date(data.beginDate);
                    convertObj.end = new Date(data.endDate);
                    convertObj.type = data.type;
                    convertObj.name = data.name;
                    convertObj.banner = data.topBanner;
                    convertObj.desc = data.info;
                    return originRef;
                })
            } },
    { sub: [
        'investor'
    ] },
    { });

    return service;
	}
);
