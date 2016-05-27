(function () {
    var angular = require('angular');
    angular.module('defaultApp.service')
        .service('ClaimService', ClaimService);

    function ClaimService(BasicService, CredentialService) {
        var NOT_LOGIN = 403;
        var topApi = {
            checkClaim: {
                method: 'GET',
                params: {
                    action: 'check'
                }
            }, claim: {
                method: 'POST'
            }
        };

        var subActions = [];

        var subApi = {

        };

        var claimInstance =  BasicService('/api/company/qc/:action',
                topApi, subActions, subApi);

        claimInstance.check = check;
        claimInstance.claimCompany = claimCompany;
        return {
            check: check,
            claimCompany: claimCompany
        };
        function check(cid) {
            return claimInstance.checkClaim({
                cid: cid
            }).$promise
            .then(function checked(data) {
                return data;
            }).catch(function checkFailed(data) {
                if (data.code === NOT_LOGIN) {
                    CredentialService.directToLoginSimple();
                } else {
                    return {
                        failed: true,
                        msg: data.msg
                    };
                }

            });
        }

        function claimCompany(data) {
            return claimInstance.claim(data).$promise;
        }

    }
}());
