var angular = require('angular');

angular.module('defaultApp.service').service('FindService', function (BasicService, $http) {

    //轮播图
    this.getRoundpics = function () {
        return $http.get('/api/mobi-investor/roundpics/v2');
    };

    //发现页融资速递轮询
    this.getFinanceNewStr = function () {
        return $http.get('/api/mobi-investor/poll/financeNewStr');
    };

    //发现页项目集轮询
    this.getHasNew = function (psts) {
        return $http.get('/api/mobi-investor/poll/hasNew?psts=' + psts);
    };

    //发现页项目集轮询
    this.filter = function () {
        return $http.get('/api/mobi-investor/company/finance-new/filter');
    };

    //每日报道
    this.getDailyReport = function (ts) {
        return $http.get('/api/mobi-investor/daily-report?ts=' + ts);
    };

    //投资热点项目集列表
    this.getHotSpotList = function (request) {
        return $http.get('/api/mobi-investor/proSetColumn/detail/hotspot/list?' + $.param(request));
    };

    //项目列表
    this.getProjectList = function (request) {
        return $http.get('/api/mobi-investor/demoday/pro-set/v3?' + $.param(request));
    };

    //项目列表简介
    this.getProjectColumn = function (request) {
        return $http.get('/api/mobi-investor/demoday/pro-set-info?' + $.param(request));
    };

    //投资热点项目集列表
    this.getCalendarList = function (request) {
        return $http.get('/api/mobi-investor/proSetColumn/detail/calendar/list?' + $.param(request));
    };

    //发现页最新融资速递
    this.getFinanceList = function (request) {
        return $http.get('/api/mobi-investor/company/finance-new/group/v2?' + $.param(request));
    };

    //融资速递查询项目数
    this.getFilterCount = function (request) {
        return $http.get('/api/mobi-investor/company/finance-new/filter/count?' + $.param(request));
    };
});
