var angular = require('angular');
angular.module('defaultApp.service')
.service('projectColumnService',  projectColumnService);

function projectColumnService(BasicService) {
    var BASE_URL = '/api/mobi-investor/proSetColumn/:action/:id';
    var projectColumn = BasicService(BASE_URL, {
        getDetail: {
            url: '/api/mobi-investor/proSetColumn/detail/:id/list',
            method: 'GET'
        }
    });

    this.getColumn = getColumn;
    this.getDetail = getDetail;

    function getColumn(id) {
        return projectColumn.get({
            id: id
        }).$promise;
    }

    function getDetail(id, page, pageSize) {
        pageSize = pageSize || 10;
        page = page || 1;
        return projectColumn.getDetail({
            id: id,
            page: page,
            pageSize: pageSize
        }).$promise;
    }
}
