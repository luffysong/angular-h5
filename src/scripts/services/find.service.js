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
    //this.getDailyReport = function (ts) {
    //    return $http.get('/api/mobi-investor/daily-report?ts=' + ts);
    //};
    this.getDailyReport = function (request) {
        return $http.get('/api/mobi-investor/daily-report-condition?' + $.param(request));
    };


    //报道行业
    this.getIndustry = function () {
        return $http.get('/api/mobi-investor/get-industry');
    };

    //报道来源
    this.getWebsite = function () {
        return $http.get('/api/mobi-investor/get-website');
    };
    //媒体热议查询项目数
    this.getFilterSourceFlagCount = function (request) {
        return $http.get('/api/mobi-investor/daily-report-count-condition?' + $.param(request));
    };

    //投资热点项目集列表
    this.getHotSpotList = function (request) {
        return $http.get('/api/mobi-investor/proSetColumn/detail/hotspot/list?' + $.param(request));
    };

    //投资 最热列表
    this.getHottestList = function (request) {
        return $http.get('/api/mobi-investor/proSetColumn/detail/hottest/list?' + $.param(request));
    };

    //投资 最近列表
    this.getLatestList = function (request) {
        return $http.get('/api/mobi-investor/proSetColumn/detail/latest/list?' + $.param(request));
    };

    //投资 机构在融
    this.getFundingList = function (request) {
        return $http.get('/api/mobi-investor/proSetColumn/detail/funding/list?' + $.param(request));
    };

    //项目列表
    this.getProjectList = function (request) {
        //console.log(request);
        return $http.get('/api/mobi-investor/demoday/pro-set/share?pageSize=' + request.pageSize + '&proSetId=' + request.proSetId);
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

    //获取用户基本信息
    this.getUserProfile = function () {
        return $http.get('/api/mobi-investor/user/profile');
    };

    //修改栏目标题
    this.editUserProfile = function (request) {
        return $http.put('/api/mobi-investor/user/profile', request);
    };

    //提交活动报名
    this.setActivity = function (request) {
        return $http.post('/api/mobi-investor/op-activity/submit', request);
    };

    //查看是否参与过活动
    this.getActivity = function (request) {
        return $http.get('/api/mobi-investor/op-activity/submit?' + $.param(request));
    };

    // 关注热点列表
    this.getHotFocus = function (params) {
        return $http.get('/api/mobi-investor/focus-hot?' + $.param(params));
    };

    // 关注热点详情
    this.getHotFocusDetail = function (id, params) {
        return $http.get('/api/mobi-investor/focus-hot/' + id + '/detail?' + $.param(params));
    };
});
