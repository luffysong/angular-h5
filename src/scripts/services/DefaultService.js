var angular = require('angular');

angular.module('defaultApp.service').service('DefaultService', function ($http) {
    return {
        /**
         * @api {post} /api/uptoken 获取又拍云 Token 信息
         * @apiName uptoken
         * @apiGroup Default
         * @apiVersion 0.0.1
         *
         * @apiParam {String} bucket UPYUN 空间名
         * @apiParam {String} expiration 过期时间
         * @apiParam {String} save-key 保存路径
         *
         * @apiSuccess {Number} code 标示码
         * @apiSuccess {Object} data 数据
         * @apiSuccess {String} data.policy 上传 Policy
         * @apiSuccess {String} data.signature 上传 Signature
         *
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       code: 0,
         *       data: {
         *         "policy":"eyJidWNrZXQiOiJ0ZXN0LWtyIiwiZXhwaXJhdGlvbiI6MTQyMTQyNTIyNywic2F2ZS1rZXkiOiIve3llYXJ9e21vbn0ve2RheX0ve2ZpbGVtZDV9LXtyYW5kb219ey5zdWZmaXh9In0=",
         *         "signature":"621db6c45d1ed7ca7f068115a409ab6c"
         *       }
         *     }
         */
        getUpToken: function (options, file) {
            var data = $.extend({}, {
                bucket: kr.upyun.bucket.name,
                expiration: parseInt((new Date().getTime() + 600000) / 1000, 10),
                'save-key': '/{year}{mon}/{day}{hour}{min}{sec}/{random}{.suffix}'
            }, options);

            return $http.post('/api/upload/form-api', {
          param: JSON.stringify(data),
          type: file ? 'file' : 'pic'
      }).then(function (response) {
          return response.data;
      });
        }
    };
});
