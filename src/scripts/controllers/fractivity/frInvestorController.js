
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('FrInvestorController', FrInvestorController);

function FrInvestorController($stateParams, ActivityService, $state, UserService,
  ErrorService, FindService, $scope, DefaultService, $upload) {
    var vm = this;
    vm.activityName = $stateParams.activityName;
    vm.investorRole = [{
        value: 'INDIVIDUAL',
        desc: '个人'
    }, {
        value: 'ORGANIZATION',
        desc: '机构'
    }, {
        value: 'COMPANY',
        desc: '公司'
    }];

    vm.investorType = [{
        value: 'ORG_INVESTOR',
        desc: '机构投资人'
    }, {
        value: 'COMPANY_INVEST_DEPT',
        desc: '公司投资人'
    }, {
        value: 'PERSONAL_INVESTOR',
        desc: '个人投资人'
    }];

    vm.investor = {
        actId: '',
        bizCard:'',
        entityName:'',
        entityType:'',
        investorRole:'',
        realName:''
    };
    init();

    function init() {
        initUser();
    }

    function initUser() {
        if (!UserService.getUID()) {
            $state.go('findLogin', {
                activityName: vm.activityName
            });
        } else {
            FindService.getUserProfile()
                .then(function (data) {
                    console.log(data);
                })
                .catch(error);
        }
    }

    $scope.imgFileSelected = function (scope, files) {
        var upyun = window.kr.upyun;
        if (files[0].size > 5 * 1024 * 1024) {
            scope.$setValidity('size', true);
            return;
        }

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            scope.uploading = true;
            scope.progress = 0;
            DefaultService.getUpToken({
                'x-gmkerl-type': 'fix_width', //限定宽度,高度自适应
                'x-gmkerl-value': '900', //限定的宽度的值
                'x-gmkerl-unsharp': true
            }).then(function (data) {
                $upload.upload({
                    url: upyun.api + '/' + upyun.bucket.name,
                    data: data,
                    file: file,
                    withCredentials: false
                }).progress(function (evt) {
                    scope.progress = evt.loaded * 100 / evt.total;
                }).success(function (data) {

                    var reader = new FileReader();

                    var filename = data.url.toLowerCase();
                    if (filename.indexOf('.jpg') !== -1 || (filename.indexOf('.png') !== -1) ||
                        filename.indexOf('.gif') !== -1 || filename.indexOf('.jpeg') !== -1) {

                        scope.uploaded = window.kr.upyun.bucket.url + data.url;
                        reader.readAsDataURL(file);
                        scope.$setValidity('required', true);
                    } else {
                        scope.$setValidity('type', false);
                    }

                    scope.uploading = false;
                }).error(function () {
                    scope.$setValidity('type', false);
                    scope.uploading = false;
                });
            }, function (err) {

                scope.uploading = false;
                ErrorService.alert(err);
            });
        }
    };

    function error(err) {
        ErrorService.alert(err);
    }

}
