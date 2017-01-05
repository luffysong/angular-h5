var angular = require('angular');

angular.module('defaultApp.service').service('ActivityService', function (BasicService, $http) {

    //创业者报名
    this.startUpSignUp = function (request) {
        return $http.post('/api/mobi-investor/activity/v2/apply?as=startup', request);
    };

    //创业者报名状态
    this.startUpState = function (request) {
        return $http.get('/api/mobi-investor/activity/v2/apply?as=startup&actId=' + request);
    };

    //投资人报名
    this.investorSignUp = function (request) {
        return $http.post('/api/mobi-investor/activity/v2/apply?as=investor', request);
    };

    //投资人报名状态
    this.investorState = function (request) {
        return $http.get('/api/mobi-investor/activity/v2/apply?as=investor&actId=' + request);
    };

    //活动详情
    this.actInfo = function (request) {
        return $http.get('/api/mobi-investor/activity/v2?actId=' + request);
    };

    //投资人申请状态
    this.investorApplyState = function (request) {
        return $http.get(' /api/activity/v2/apply?as=investor&' + request);
    };

    //创业者申请状态
    this.startUpApplyState = function (request) {
        return $http.get('/api/activity/v2/apply?as=startup&' + $.param(request));
    };

});
