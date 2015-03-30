/**
 * Controller Name: SearchController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('SearchController',
    function($scope, SearchService) {
        $scope.doSearch = function(e){
            e.preventDefault();
            SearchService.query({
                kw: $scope.keyword,
                type: 1,
                page: 1,
                pageSize:30
            }, function (list) {
                $scope.searchResult = list.results;
            });
        }
    }
);
