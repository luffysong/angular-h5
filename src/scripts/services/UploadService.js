(function () {
    var angular = require('angular');
    angular.module('defaultApp.service')
        .service('UploadService', UploadService);

    function UploadService($upload, DefaultService, $q) {

        var SUCCESS = 0;
        var FAILED = 1;
        var upyun = window.kr.upyun;

        this.create = createUploaded;
        function createUploaded() {
            return new Uploader();
        }

        function Uploader() {
            var deferred = null;

            this.upload = upload;

            function upload(config, file) {
                deferred = $q.defer();
                DefaultService.getUpToken(config)
                    .then(function startUploadFile(data) {
                        $upload.upload({
                            url: upyun.api + '/' + upyun.bucket.name,
                            data: data,
                            file: file,
                            withCredentials: false
                        })
                        .then(uploadFileSuccess)
                        .catch(failed);
                    })
                    .catch(failed);

                return deferred.promise;
            }

            function failed(err) {
                deferred.reject({
                    code: err.code || FAILED,
                    err: err
                });
            }

            function uploadFileSuccess(data) {
                deferred.resolve({
                    code: SUCCESS,
                    url: upyun.bucket.url + data.data.url,
                    data: data.data
                });
            }
        }
    }

}());
