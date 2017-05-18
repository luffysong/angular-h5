var angular = require('angular');

angular.module('defaultApp.service').service('BangDanService', function(BasicService, $http) {

    var BASE_URL = '/api/mobi-investor/rank';

    //机构排行
    this.getOrgRank = function (request) {
        return $http.get(BASE_URL + '/org/list?' + $.param(request));
    };

    //单个机构详情
    this.getSingleOrgInfo = function (id) {
        return $http.get(BASE_URL + '/org/' + id);
    };

    //机构项目排行
    this.getOrgProRank = function (id, request) {
        return $http.get(BASE_URL + '/org/' + id + '/projects?' + $.param(request));
    };

    //转发次数
    this.forwardCount = function (id) {
        return $http.put(BASE_URL + '/org/' + id + '/forwardCount');
    };

    //投资人排行
    this.getInvestorRank = function (request) {
        return $http.get(BASE_URL + '/investor/list?' + $.param(request));
    };

    //单个投资人详情
    this.getSingleInvestorInfo = function (id) {
        return $http.get(BASE_URL + '/investor/' + id);
    };

    //投资人项目排行
    this.getInvestorProRank = function (id, request) {
        return $http.get(BASE_URL + '/investor/' + id + '/projects?' + $.param(request));
    };

    //转发次数
    this.investorforwardCount = function (id) {
        return $http.put(BASE_URL + '/investor/' + id + '/forwardCount');
    };
});
