var angular = require('angular');

angular.module('defaultApp.service').service('BangDanService', function(BasicService, $http) {

    var BASE_URL = '/api/mobi-investor/rank';

    //机构排行
    this.getOrgRank = function (request) {
        return $http.get(BASE_URL + '/org/list?' + $.param(request));
    };

    //单个机构详情
    this.getSingleOrgInfo = function (id, request) {
        var r ;
        if (request) {
            r =$http.get(BASE_URL + '/org/' + id + '?'+ $.param(request));
        } else {
            r =$http.get(BASE_URL + '/org/' + id);
        }
        return r;
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
    this.getSingleInvestorInfo = function (id, request) {
        var r ;
        if (request) {
            r =  $http.get(BASE_URL + '/investor/' + id + '?'+ $.param(request));
        } else {
            r =  $http.get(BASE_URL + '/investor/' + id);
        }
        return r;
    };

    //投资人项目排行
    this.getInvestorProRank = function (id, request) {
        return $http.get(BASE_URL + '/investor/' + id + '/projects?' + $.param(request));
    };

    //转发次数
    this.investorforwardCount = function (id) {
        return $http.put(BASE_URL + '/investor/' + id + '/forwardCount');
    };

    //社群排行
    this.getComRank = function (request) {
        return $http.get(BASE_URL + '/community/list?' + $.param(request));
    };

    //单个社群详情
    this.getSingleComInfo = function (id, request) {
        var r ;
        if (request) {
            r = $http.get(BASE_URL + '/community/' + id + '?'+ $.param(request));
        } else {
            r = $http.get(BASE_URL + '/community/' + id);
        }
        return r;
    };

    //社群项目排行
    this.getComProRank = function (id, request) {
        return $http.get(BASE_URL + '/community/' + id + '/projects?' + $.param(request));
    };

    //社群转发次数
    this.comforwardCount = function (id) {
        return $http.put(BASE_URL + '/community/' + id + '/forwardCount');
    };

    //
    this.getTestJson = function () {
        return $http.get('./test.json');
    };

    //机构行业
    this.getOrgIndustry= function () {
        return $http.get(BASE_URL + '/org/industry');
    };

    //投资人行业
    this.getInvestorIndustry= function () {
        return $http.get(BASE_URL + '/investor/industry');
    };

    //社群行业
    this.getComIndustry= function () {
        return $http.get(BASE_URL + '/community/industry');
    };
});
