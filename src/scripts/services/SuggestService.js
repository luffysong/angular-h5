/**
 * Service Name: SuggestService
 */

var angular = require('angular');

angular.module('defaultApp.service').service('SuggestService', [
    '$location', 'BasicService', 'appendTransform', '$http',
    function ($location, BasicService, appendTransform, $http) {
        /**
         * @api {get} /api/suggest 联想结果(公司，人，投资机构)
         * @apiName suggest
         * @apiGroup Suggest
         * @apiVersion 0.0.1
         *
         * @apiParam {String} query 搜索输入文字
         * @apiParam {String} [type=1,2,3] 数据类型 1(公司)，2(投资人)，3(投资机构)
         *
         * @apiSuccess {Number} code 标示码
         * @apiSuccess {Object} data 数据
         * @apiSuccess {Object[]} data.list 结果数据数组
         *
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
     *       code: 0,
     *       data: {
     *         data: [{
     *           id: 1,
     *           avatar: 'http://placehold.it/40x40/09f/fff',
     *           name: '小米科技',
     *           type: '1'
     *         }, {
     *           id: 2,
     *           avatar: 'http://placehold.it/40x40/09f/fff',
     *           name: '雷军',
     *           type: '2'
     *         }]
     *       }
     *     }
         */

        //console.log(BasicService)
        var service = BasicService('//' + projectEnvConfig.nrongHost + '/n/api/suggest/:sub', {
            /**
             * @api {get} /api/suggest/field 联想结果(公司领域)
             * @apiName suggest field
             * @apiGroup Suggest
             * @apiVersion 0.0.1
             *
             * @apiParam {String} query 搜索输入文字
             *
             * @apiSuccess {Number} code 标示码
             * @apiSuccess {Object} data 数据
             * @apiSuccess {Object[]} data.list 结果数据数组
             *
             * @apiSuccessExample {json} Success-Response:
             *     HTTP/1.1 200 OK
             *     {
             *    code: 0,
             *    data: {
             *      list: [{
             *        id: 1,
             *        name: '互联网',
             *        info: '200' // 有多少公司使用此标签
             *      }, {
             *        id: 2,
             *        name: '物联网',
             *        info: '300' // 有多少公司使用此标签
             *      }]
             *    }
             *  }
             */
            query: {
                method: 'GET',
                transformResponse: appendTransform($http.defaults.transformResponse, function (data) {
                    if (data.data && data.data.list) {
                        data.data.data = data.data.list;
                    }

                    return data;
                })
            },
            queryFields: {
                method: 'GET',
                params: {
                    sub: 'field'
                }
            },
            queryCompany: {
                method: 'GET',
                params: {
                    sub: 'company'
                }
            },
            queryOrganization: {
                method: 'GET',
                params: {
                    sub: 'institution'
                }
            },
            queryInvestor: {
                method: 'GET',
                params: {
                    sub: 'investor'
                }
            },
            queryComAndOrg: {
                params: {
                    sub: 'com-and-org',
                },
                isArray: true,
            },
            queryPosition: {
                params: {
                    sub: 'position'
                }
            },
            querySchool: {
                method: 'GET',
                params: {
                    sub: 'school'
                }
            }

            // queryInvestor: {
            //     method: "GET",
            //     params: {
            //         sub: "investor"
            //     }
            // },
            // queryUser: {
            //     method: "GET",
            //     params: {
            //         sub: "user"
            //     }
            // }
        });

        return service;
    }
]);
