var angular = require('angular');

angular.module('defaultApp.service').service('RongziService', function (BasicService, $http) {

    var BASE_URL = '/api/mobi-investor/activity/funding_season';

    //取消开场提醒
    this.cancelSubscribe = function (request) {
        return $http.post(BASE_URL + '/session/unsubscibe?' +  $.param(request));
    };

    //设置开场提醒
    this.setSubscribe = function (request) {
        return $http.post(BASE_URL + '/session/subscibe?' + $.param(request));
    };

    //设置Email
    this.setEmail = function (request) {
        return $http.put(BASE_URL + '/session/subscibe/email?', request);
    };

    //设置开场提醒
    this.setRemind = function (request) {
        return $http.post(BASE_URL + '/session/remind?' +  $.param(request));
    };

    //获取创业社群专场界面内容
    this.getCommunity = function (request) {
        return $http.get(BASE_URL + '/session/association?' + $.param(request));
    };

    //获取投资人专场界面内容
    this.getInvestor = function (request) {
        return $http.get(BASE_URL + '/session/investor?' + $.param(request));
    };

    //获取顶级机构专场界面内容
    this.getOrg = function (request) {
        return $http.get(BASE_URL + '/session/org?' + $.param(request));
    };

    //融资季主会场
    this.getHome = function () {
        return $http.get(BASE_URL + '/home?');
    };

    //设置用户提醒+邮箱
    this.setUserAndEmail = function (request) {
        return $http.put(BASE_URL + '/session/remind/email?' + $.param(request));
    };

    //报名参加活动
    this.applyAct = function (request) {
        return $http.post(BASE_URL + '/startup_project/apply?' + $.param(request));
    };

    //获取创业项目榜单列表
    this.getProList = function (request) {
        return $http.get(BASE_URL + '/startup_project/list?' + $.param(request));
    };

    //获取当前管理的项目
    this.getMagPro = function () {
        return $http.get(BASE_URL + '/managed_projects?');
    };

    //获取榜单项目详情
    this.getProDetail = function (id) {
        return $http.get(BASE_URL + '/startup_project/' + id);
    };

});
