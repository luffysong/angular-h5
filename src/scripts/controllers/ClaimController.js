/**
 * Controller Name: ClaimController
 */
(function () {
    var  angular = require('angular');
    angular.module('defaultApp.controller')
        .controller('ClaimController', ClaimController);

    function ClaimController(UploadService, ErrorService, CredentialService, ClaimService,
            checkForm, user, $stateParams) {
        var vm = this;
        var uploader = UploadService.create();

        vm.name = user.name;
        vm.position = user.positionDetail;
        vm.identity = user.position;
        vm.claimed = user.claimed;
        vm.failed = user.failed;
        vm.msg = user.msg;

        vm.upload = upload;
        vm.logout = logout;
        vm.claim = claim;

        initialize();

        function initialize() {
            angular.extend(vm, {});
        }

        function upload(files) {
            if (!files) {
                return;
            }

            uploader.upload({
                'x-gmkerl-type': 'fix_width', //限定宽度,高度自适应
                'x-gmkerl-value': '900',      //限定的宽度的值
                'x-gmkerl-unsharp': true
            }, files[0])
            .then(imgUploadSuccess)
            .catch(failed);
        }

        function claim() {
            if (!checkForm('claimForm')) {
                return;
            }

            ClaimService.claimCompany({
                name: vm.name,
                position: vm.identity,
                positionDetail: vm.position,
                avatar: vm.avatar,
                cid: $stateParams.id
            }).then(function claimSuccess() {
                vm.claimed = true;
            }).catch(function claimFailed(data) {
                vm.failed = true;
                vm.msg = data.msg;
            });
        }

        function logout() {
            CredentialService.logout()
                .then(function logoutCb() {
                    CredentialService.directToLoginSimple();
                });
        }

        function imgUploadSuccess(data) {
            vm.avatar = data.url;
        }

        function failed(err) {
            ErrorService.alert(err.err.msg);
        }
    }
}());
