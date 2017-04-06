var angular = require('angular');
angular.module('defaultApp.service').service('LinkedmeService',
    function () {
        this.getLinkedmeUrl = function (params, callback) {
            var krdata = {};
            krdata.type =  window.projectEnvConfig.linkmeType;
            krdata.params =
            '{"openlink": "' + params.openlink + '","currentRoom":"' + params.currentRoom + '" }';
            window.linkedme.init(window.projectEnvConfig.linkmeKey,
            { type: window.projectEnvConfig.linkmeType }, function (err, res) {
                    if (err) {
                        return;
                    }

                    window.linkedme.link(krdata, function (err, data) {
                            if (err) {
                                // 生成深度链接失败，返回错误对象err
                                console.log(err, res);
                            } else {
                                // 生成深度链接成功，深度链接可以通过data.url得到
                                if (data.url) {
                                    callback(data.url);
                                }
                            }
                        }, false);
                });
        };
    }
);
