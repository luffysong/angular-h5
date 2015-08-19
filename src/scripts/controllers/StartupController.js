var angular = require('angular');

angular.module('defaultApp.controller').controller('startupController', [
    '$scope', 'StartupService', 'ErrorService', 'UserService', 'CompanyService', '$modal', '$state', 'notify', '$stateParams',
    function($scope, StartupService, ErrorService, UserService, CompanyService, $modal, $state, notify, $stateParams) {
        if(!!$stateParams.token) {
            $scope.token = $stateParams.token;
            $modal.open({
                templateUrl: 'templates/startup/pop-startup-share.html',
                windowClass: 'startup-share-modal'
            });
        }

        if(!!$stateParams.code) {
            $scope.code = $stateParams.code;
        }

        $scope.product = {};
        if(!!$stateParams.type) {
            $scope.product.type = $stateParams.type;
        }

        if(!!$stateParams.id) {
            $scope.product.id = $stateParams.id;
        }

        /**
         * 查看活动规则
         */
        $scope.seeRules = function() {
            $modal.open({
                templateUrl: 'templates/startup/pop-startup-rules.html',
                windowClass: 'startup-modal',
                controller: [
                    '$scope', '$modalInstance', 'scope',
                    function($scope, $modalInstance, scope) {
                        $scope.createUrl = scope.createUrl;

                        $scope.close = function () {
                            $modalInstance.dismiss();
                        }
                    }
                ],
                resolve: {
                    scope: function(){
                        return $scope;
                    }
                }
            });
        };

        /**
         * 用户信息
         */
        $scope.user = {};
        // 获取 UID
        $scope.user.uid = UserService.getUID();
        // 获取用户是否有手机号
        UserService.getPhone(function(data) {
            $scope.hasPhone = !!data;
        });

        /**
         * 创建公司 Url
         */
        $scope.createUrl = '/m/#/company_create';

        /**
         * 获取服务供应商商品列表
         */
        $scope.getList = function() {
            StartupService['index'].get({

            }, function(res) {
                /* 获取活动时间状态 */
                var startTime = new Date(res.start_time.replace(/-/g, '/'));
                var now = new Date();
                var endTime   = new Date(res.end_time.replace(/-/g, '/'));
                if(now.valueOf() < startTime.valueOf()) {
                    $scope.status = 'before';
                } else if(now.valueOf() > endTime.valueOf()) {
                    $scope.status = 'after';
                } else {
                    $scope.status = 'during';
                }

                /* 活动是否即将结束 */
                if(now.getDate() == endTime.getDate()) {
                    $scope.ending = true;
                }

                $scope.listData = res.list;

                if($stateParams.type && $stateParams.id) {
                    $scope.product.provider = $scope.listData[$scope.product.type]['list'][$scope.product.id - 1].server_name;
                }
            }, function(err) {
                ErrorService.alert(err);
            });
        };

        $scope.getList();


        /**
         * 开抢提醒
         */
        $scope.startRemind = function() {
            if(!$scope.user.uid) {
                $state.go('startupLogin');
            } else if(!$scope.hasPhone) {
                 $modal.open({
                    templateUrl: 'templates/startup/pop-startup-phone.html',
                    windowClass: 'startup-modal',
                    controller: [
                        '$scope', '$modalInstance',
                        function($scope, $modalInstance) {
                            $scope.startRemindAgain = true;

                            $scope.close = function () {
                                $modalInstance.dismiss();
                            }
                        }
                    ],
                    resolve: {
                        scope: function(){
                            return $scope;
                        }
                    }
                });
            } else {
                StartupService['start-remind'].post({

                }, function(res) {
                    $modal.open({
                        templateUrl: 'templates/startup/pop-startup-remind.html',
                        windowClass: 'startup-modal',
                        controller: [
                            '$scope', '$modalInstance',
                            function($scope, $modalInstance) {
                                $scope.close = function () {
                                    $modalInstance.dismiss();
                                }
                            }
                        ],
                        resolve: {
                            scope: function(){
                                return $scope;
                            }
                        }
                    });
                }, function(err) {
                    if(err.msg == '您已设置过开抢提醒') {
                        $modal.open({
                            templateUrl: 'templates/startup/pop-startup-remind.html',
                            windowClass: 'startup-modal',
                            controller: [
                                '$scope', '$modalInstance',
                                function($scope, $modalInstance) {
                                    $scope.startRemindAgain = true;

                                    $scope.close = function () {
                                        $modalInstance.dismiss();
                                    }
                                }
                            ],
                            resolve: {
                                scope: function(){
                                    return $scope;
                                }
                            }
                        });
                    } else {
                        ErrorService.alert(err);
                    }
                });
            }
        };

        /**
         * 点击抢码
         */
        $scope.getCode = function(id, provider) {
            if(!id) return;
            $scope.product.provider = provider;
            if(!$scope.user.uid) {
                $state.go('startupLogin');
            } else {
                /* 获取token */
                StartupService['qr-code-token'].post({
                    'product_id': id
                }, function(res) {
                    $scope.token = res.token;
                    $modal.open({
                        templateUrl: 'templates/startup/pop-startup-share.html',
                        windowClass: 'startup-share-modal'
                    });

                    /*
                        StartupService['code'].post({
                            'token': $scope.token
                        }, function(res) {
                            if(res.code) {
                                $state.go('startupCode', {
                                    code: res.code
                                });
                            }
                        }, function(err) {
                            ErrorService.alert(err);
                        });
                    */
                }, function(err) {
                    if(err.code == 2001) {
                        $modal.open({
                            templateUrl: 'templates/startup/pop-startup-error.html',
                            windowClass: 'startup-modal',
                            controller: [
                                '$scope', '$modalInstance',
                                function($scope, $modalInstance) {
                                    $scope.errorMsg = '你已经抢过该福利啦';

                                    $scope.close = function () {
                                        $modalInstance.dismiss();
                                    }
                                }
                            ],
                            resolve: {
                                scope: function(){
                                    return $scope;
                                }
                            }
                        });
                    } else if(err.code == 2002) {
                        $state.go('startupCompany');
                    } else if(err.code == 2003) {
                        $modal.open({
                            templateUrl: 'templates/startup/pop-startup-error.html',
                            windowClass: 'startup-modal',
                            controller: [
                                '$scope', '$modalInstance',
                                function($scope, $modalInstance) {
                                    $scope.errorMsg = '你已经抢过3项服务啦，把机会留给更多的创业者吧！';

                                    $scope.close = function () {
                                        $modalInstance.dismiss();
                                    }
                                }
                            ],
                            resolve: {
                                scope: function(){
                                    return $scope;
                                }
                            }
                        });
                    } else if(err.code == 2004) {
                        $modal.open({
                            templateUrl: 'templates/startup/pop-startup-error.html',
                            windowClass: 'startup-modal',
                            controller: [
                                '$scope', '$modalInstance',
                                function($scope, $modalInstance) {
                                    $scope.errorMsg = '你已经抢过该专区内的福利啦';

                                    $scope.close = function () {
                                        $modalInstance.dismiss();
                                    }
                                }
                            ],
                            resolve: {
                                scope: function(){
                                    return $scope;
                                }
                            }
                        });
                    } else {
                        ErrorService.alert(err);
                    }
                });
            }
        };

        /**
         * 微信分享
         */
        document.title = "创业狂欢节";

        $scope.InitWeixin = function() {
            var signature = '';
            var nonceStr = 'xcvdsjlk$klsc';
            var timestamp = parseInt(new Date().getTime()/1000);

            $.get('/api/weixin/token', {
                url: location.href.replace(/#.*$/, ''),
                timestamp: timestamp,
                noncestr: nonceStr
            }, function(data) {
                if(data.code!=0)return;
                if(!data.data)return;
                if(!data.data.token)return;

                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: 'wxd3ea1a9a22815a8c', // 必填，公众号的唯一标识
                    timestamp: timestamp, // 必填，生成签名的时间戳
                    nonceStr: nonceStr, // 必填，生成签名的随机串
                    signature: data.data.token,// 必填，签名，见附录1
                    jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });

                wx.ready(function() {
                    wx.onMenuShareTimeline({
                        title: WEIXINSHARE.shareTitle, // 分享标题
                        link: WEIXINSHARE.shareLink || location.href, // 分享链接
                        imgUrl: WEIXINSHARE.shareImg || 'http://d.36kr.com/assets/36kr.png', // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                            StartupService['code'].post({
                                'token': $scope.token
                            }, function(res) {
                                if(res.code) {
                                    $state.go('startupCode', {
                                        code: res.code
                                    });
                                }
                            }, function(err) {
                                ErrorService.alert(err);
                            });
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });

                    wx.onMenuShareAppMessage({
                        title: WEIXINSHARE.shareTitle, // 分享标题
                        desc: WEIXINSHARE.shareDesc, // 分享描述
                        link: WEIXINSHARE.shareLink || location.href, // 分享链接
                        imgUrl: WEIXINSHARE.shareImg || 'http://d.36kr.com/assets/36kr.png', // 分享图标
                        type: 'link', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function () {
                            // 用户确认分享后执行的回调函数
                            StartupService['code'].post({
                                'token': $scope.token
                            }, function(res) {
                                if(res.code) {
                                    $state.go('startupCode', {
                                        code: res.code
                                    });
                                }
                            }, function(err) {
                                ErrorService.alert(err);
                            });

                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });

                    wx.error(function(res) {

                    });
                });
            }, 'jsonp');
        };

        $scope.$watch('provider', function(from) {
            if(from) {
                 WEIXINSHARE = {
                    shareTitle: "我在“创业狂欢节”抢到“" + from + "”的创业福利。来36氪抢不停！",
                    shareDesc: "8.18-8.25创业狂欢节，来36氪抢不停。",
                    shareImg: 'http://krplus-pic.b0.upaiyun.com/201508/18/362db0f78c03d5575030a684f390f1ad.jpg',
                    shareLink: 'https://rong.36kr.com/#/startup'
                };
            } else {
                WEIXINSHARE = {
                    shareTitle: "“创业狂欢节”是个什么Gui？28项创业福利，来36氪抢不停！",
                    shareDesc: "8.18-8.25创业狂欢节，来36氪抢不停。",
                    shareImg: 'http://krplus-pic.b0.upaiyun.com/201508/18/362db0f78c03d5575030a684f390f1ad.jpg',
                    shareLink: 'https://rong.36kr.com/#/startup'
                };
            }

            $scope.InitWeixin();
        });
    }
]);
