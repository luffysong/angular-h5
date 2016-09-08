
var angular = require('angular');
angular.module('defaultApp.service')
.service('demosService',  demosService);

function demosService(BasicService) {
    var PWD_KEY_PREFIX = 'DEMO_PWD.';
    var network = createNetWork(BasicService);

    this.getDemos = getDemos;
    this.getBaseInfo = getBaseInfo;
    this.getToken = getToken;

    function saveToken(id, token) {
        if (token) {
            localStorage.setItem(getKey(id), token);
        }
    }

    function getToken(id) {
        return localStorage.getItem(getKey(id));
    }

    function getKey(id) {
        return PWD_KEY_PREFIX + id;
    }

    function getDemos(id, pwd, page) {
        var token = getToken(id);
        if (typeof pwd === 'number') {
            page = pwd;
        }

        page = page || 1;
        return network.getDemos({
            proSetId: id,
            idNum: token,
            verifyCode: pwd,
            pageSize: 10,
            page: page
        }).$promise
        .then(function demosSuccess(data) {
            saveToken(id, data.idNum);
            return data.data;
        });
    }

    function getBaseInfo(id) {
        return network.getCount({
            proSetId: id
        }).$promise;
    }
}

function createNetWork(BasicService) {
    var topApi = {
        getDemos: {
            method: 'GET',
            params: {
                action: 'pro-set'
            }
        }, getCount: {
            method: 'GET',
            params:{
                action: 'pro-set-info'
            }
        }
    };

    var demosInstance =  BasicService('/api/mobi-investor/demoday/:action',
        topApi);
    return demosInstance;
}
