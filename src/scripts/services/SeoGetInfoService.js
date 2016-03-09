/**
 * Service Name: SeoGetMetaService
 */

var angular = require('angular');

angular.module('defaultApp.service').service('SeoGetInfoService', [
    'seoInfo', '$location', '$http', '$rootElement',
    function (seoInfo, $location, $http) {
        var apiBaseUrl = '/api/p/sm/seo/summary';

        // var apiBaseUrl = 'http://smtest01.corp.36kr.com/seo/summary';
        var service = {};
        service.getMeta = function (tml, id) {
            var url = seoInfo.meta.url;
            $http.get(url + seoInfo.meta[tml].tmlId + '/' + id).then(function (data) {

                $.each(seoInfo.meta.filter_tag, function (i, e) {
                    $(e).remove();
                });

                $('meta').each(function (i, e) {
                    for (var j = 0; j < seoInfo.meta.filter_name.length; j++) {
                        if ($(e).attr('name') === seoInfo.meta.filter_name[j]) {
                            $(e).remove();
                        }
                    }
                });

                $(data.data.meta).appendTo('head');
            }, angular.noop);
        };

        // 获取seo内链
        service.getInfoLinks = function (templateId, cid) {
            return $http.get(apiBaseUrl + '/' + templateId + '/' + cid);
        };

        return service;
    }
]);
