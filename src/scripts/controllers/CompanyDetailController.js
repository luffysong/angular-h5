/**
 * Controller Name: CompanyDetailController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('CompanyDetailController',
    function($scope, $location, $stateParams, $state, CompanyService, $timeout, UserService, ErrorService, $rootScope) {

        $scope.companyId = $stateParams.id || 12;



        $scope.company = {
            value: {}
        };

        $scope.basic = {
            value: {}
        };

        $scope.intro = {
            value: {}
        };

        // 获取公司基本信息
        $scope.companyBasicData = function(callback) {
            CompanyService.get({
                id: $scope.companyId
            }, function(data) {
                $scope.company.value = data;

                document.title=data.basic.name + " | 36氪";
                WEIXINSHARE = {
                    shareTitle: data.basic.name + " | 36氪",
                    shareDesc: data.basic.brief || data.basic.name,
                    shareImg: data.basic.logo || 'http://img.36tr.com/logo/20140520/537aecb26e02d'
                };
                InitWeixin();


                $scope.intro.value = {
                    intro: data.company.intro
                }
                if($scope.company.value.funds.privilege) {
                    $stateParams.type = 1;
                } else {
                    $stateParams.type = 4;
                }

                $location.search('type=' + $stateParams.type);

                callback && callback(data);
            }, function(err) {

            })
        };



        // if($scope.company.value.funds.privilege) {
        //     $stateParams.type = 1;
        // } else {
        //     $stateParams.type = 4;
        // }
        // console.log($stateParams);


        $scope.companyBasicData(function() {
            // 轮播图
            $scope.myInterval = 5000;

            var slides = $scope.slides = [];
            $scope.addSlide = function(i) {
                slides.push({
                    image: $scope.company.value.other.pictures[i]
                });
            };

            for (var i = 0; i < $scope.company.value.other.pictures.length; i++) {
                $scope.addSlide(i);
            }
        });

        // 格式化公司介绍
        $scope.$watch('intro.value.intro', function(val){
            if(!$scope.intro.value.intro) {
                return;
            }

            $scope.intro.html = val.replace(/>/g,'&gt;').replace(/</g,'&lt;').replace(/\n/g, '<br/>');
        });

        $scope.introLines = 5;

        //more的显示隐藏
        $timeout(function() {
            if( $scope.introLines==4)return;
            if($(".company-intro").height() > 4 * 40 && $scope.introLines!=4) {
                $scope.introLines = 4;
            } else {
                $scope.introLines = 100;
            }
        },500);

        // 子产品
        $scope.product = {
            list: [],
            listLimit: 3
        }
        $scope.loadProductData = function (callback) {
            CompanyService.product.query({
                id: $scope.companyId
            }, function (data) {
                $scope.product.list = data.data;
            }, function (err) {
                ErrorService.alert(err);
            })
        };
        $scope.loadProductData();

        // 创始团队
        $scope.founder = {
            list: [],
            listLimit: 2
        }
        $scope.loadFounderData = function (callback) {
            CompanyService.founder.query({
                id: $scope.companyId
            }, function (data) {
                $scope.founder.list = data.data;
            }, function (err) {
                ErrorService.alert(err);
            })
        };
        $scope.loadFounderData();

        //获取融资经历数据
        $scope.finance = {
            list: [],
            listLimit: 2
        }
        $scope.loadFinanceData = function (callback) {
            CompanyService.finance.query({
                id: $scope.companyId
            }, function (data) {
                $scope.finance.list = data.data;
            }, function (err) {
                ErrorService.alert(err);
            })
        };
        $scope.loadFinanceData();

        //过往投资方
        $scope.investor = {
            list: [],
            listLimit: 2
        };
        $scope.loadInvestorData = function (callback) {
            CompanyService.investor.query({
                id: $scope.companyId,
                pageSize: 100
            }, function (data) {
                $scope.investor.list = data.data;
                $scope.investor.list.forEach(function (v) {
                    if (v.type == 'COMPANY') {
                        v.link = 'companys.detail.overview({id: "' + v.investorId + '"})';
                    }
                    if (v.type == 'INDIVIDUAL') {
                        v.link = 'users.overview({id: "' + v.investorId + '"})';
                    }
                    if (v.type == 'ORGANIZATION') {
                        v.link = 'organizations.overview({id: "' + v.investorId + '"})';
                    }
                })
            }, function (err) {
                ErrorService.alert(err);
            })
        };
        $scope.loadInvestorData();

        //获取团队数据
        $scope.employee = {
            list: [],
            listLimit: 2
        }
        $scope.loadEmployeeData = function (callback) {
            CompanyService.employee.query({
                id: $scope.companyId
            }, function (data) {
                $scope.employee.list = data.data;
            }, function (err) {
                ErrorService.alert(err);
            })
        };
        $scope.loadEmployeeData();


    }
);
