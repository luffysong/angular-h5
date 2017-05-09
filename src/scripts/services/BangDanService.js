var angular = require('angular');

angular.module('defaultApp.service').service('BangDanService', function(BasicService, $http) {

    var BASE_URL = '/api/mobi-investor/rank';

    //机构排行
    this.getOrgRank = function (request) {
        return $http.get(BASE_URL + '/org' + $.param(request));
    };

    //机构项目排行
    this.getOrgProRank = function (id, request) {
        return $http.get(BASE_URL + '/org ' + id + '/projects' + $.param(request));
    };
});
