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

    //标签分类创建
    // this.createCate = function (request) {
    //     return $http.post('/api/label/cate', request);
    // };

});
