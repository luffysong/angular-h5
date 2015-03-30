/**
 * Service Name: SearchService
 */

var angular = require('angular');

/**
 * @api {get} /api/search 搜索结果
 * @apiName search
 * @apiGroup Search
 * @apiVersion 0.0.1
 *
 * @apiParam {String} query 搜索输入文字
 * @apiParam {String} [type=0] 数据类型 默认 0(全部)，1(公司)，2(投资人)，3(投资机构)
 * @apiParam {Number} [page=1] 分页
 *
 * @apiSuccess {Number} code 标示码
 * @apiSuccess {Object} data 数据
 * @apiSuccess {Number} data.count 总数
 * @apiSuccess {Object[]} data.list 结果数据数组
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       code: 0,
 *       data: {
 *         count: 100,
 *         company_count: 10,
 *         investor_count: 10,
 *         organization_count: 10,
 *         list: [{
 *           id: 1,
 *           avatar: 'http://placehold.it/40x40/09f/fff',
 *           name: '小米科技',
 *           type: '1',
 *           description: '移动互联网软硬件公司，Xxxxx'
 *         }, {
 *           id: 2,
 *           avatar: 'http://placehold.it/40x40/09f/fff',
 *           name: '雷军',
 *           type: '2',
 *           description: '著名天使投资人，Xxxxx'
 *         }]
 *       }
 *     }
 */
angular.module('defaultApp.service').service('SearchService', [
    '$location', 'BasicService',
    function ($location, BasicService) {
      var service = BasicService('/api/search', {
          query: {
              method: "POST"
          }
      });

      return service;
    }
]);
