var angular = require('angular');

angular.module('defaultApp.service').service('RongziService', function(BasicService, $http) {

    var BASE_URL = '/api/mobi-investor/activity/funding_season';

    //取消开场提醒
    this.cancelSubscribe = function(request) {
        return $http.post(BASE_URL + '/session/unsubscibe?' + $.param(request));
    };

    //设置开场提醒
    this.setSubscribe = function(request) {
        return $http.post(BASE_URL + '/session/subscibe?' + $.param(request));
    };

    //设置Email
    this.setEmail = function(request) {
        return $http.put(BASE_URL + '/session/subscibe/email?', request);
    };

    //设置开场提醒
    this.setRemind = function(request) {
        return $http.post(BASE_URL + '/session/remind?' + $.param(request));
    };

    //获取创业社群专场界面内容
    this.getCommunity = function(request) {
        return $http.get(BASE_URL + '/session/association?' + $.param(request));
    };

    //获取投资人专场界面内容
    this.getInvestor = function(request) {
        return $http.get(BASE_URL + '/session/investor?' + $.param(request));
    };

    //获取顶级机构专场界面内容
    this.getOrg = function(request) {
        return $http.get(BASE_URL + '/session/org?' + $.param(request));
    };

    //融资季主会场
    this.getHome = function() {
        return $http.get(BASE_URL + '/home?');
    };

    //设置用户提醒+邮箱
    this.setUserAndEmail = function(request) {
        return $http.put(BASE_URL + '/session/remind/email?' + $.param(request));
    };

    //报名参加活动
    this.applyAct = function(request) {
        return $http.post(BASE_URL + '/startup_project/apply?' + $.param(request));
    };

    //获取创业项目榜单列表
    this.getProList = function(request) {
        return $http.get(BASE_URL + '/startup_project/list?' + $.param(request));
    };

    //获取当前管理的项目
    this.getMagPro = function() {
        return $http.get(BASE_URL + '/managed_projects?');
    };

    //获取榜单项目详情
    this.getProDetail = function(id) {
        return $http.get(BASE_URL + '/startup_project/' + id);
    };

    //榜单点赞
    this.like = function(id) {
        return $http.post(BASE_URL + '/startup_project/' + id + '/like');
    };

    //获取当前管理的项目
    this.getManagedProjects = function() {
        return $http.get(BASE_URL + '/managed_projects');
    };

    //活动报名
    this.enroll = function(request) {
        return $http.post(BASE_URL + '/startup_project/apply?' + $.param(request));
    };

    //分享详情
    this.shareInfo = function(id) {
        return $http.get(BASE_URL + '/startup_project/' + id);
    };

    //获取已完结的数据，根据参数不同，获取不同类型的数据
    this.getFinishedData = function(request) {
        return $http.get(BASE_URL + '/session/finished?' + $.param(request));
    };

    //获取已完结专场
    this.getFinished = function(request) {
        return $http.get(BASE_URL + '/session/finished?' + $.param(request));
    };

    //获取详情页基本信息
    this.getBaseInfo = function(id) {
        return $http.get(BASE_URL + '/session/' + id);
    };

    //获取详情页项目列表
    this.getProjectList = function(id) {
        return $http.get(BASE_URL + '/session/' + id + '/projects');
        // return $http.get(BASE_URL + '/session/' + id + '/projects?debug=true');
    };

    this.getOrgLike = function() {
        return $http.get(BASE_URL + '/ranking_list/org?');
    };

    this.getComLike = function(request) {
        return $http.get(BASE_URL + '/ranking_list/startup_project?' + $.param(request));
    };

    //获取邀请码
    this.getRecCode = function() {
        return $http.post('//' + projectEnvConfig.nrongHost + '/n/api/investor/auth/get-recommend-code');
    };

    //获取邀请次数
    this.getRecCount = function() {
        return $http.get('//' + projectEnvConfig.nrongHost + '/n/api/investor/auth/get-recommendsuc-count');
    };

    //是否我发出的邀请码
    this.isInviteCode = function(request) {
        return $http.get('//' + projectEnvConfig.nrongHost + '/n/api/investor/auth//check-recommendcode-user?' + $.param(request));
    };

    //榜单列表前三
    this.getTop3 = function() {
        return $http.get(BASE_URL + '/startup_project/top?');
    };

});