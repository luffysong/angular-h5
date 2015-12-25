/**
 * Controller Name: syndicatesKrQuitController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('syndicatesKrQuitController.js',
    function($scope, loading,  $timeout) {

        loading.show("krtLoading");
        $timeout(function() {
            loading.hide("krtLoading");
        }, 1500);

        $scope.SharWeiXin = function(){
            window.WEIXINSHARE = {
                shareTitle: "36氪首创股权投资退出机制,“下轮氪退” 项目都在这里了",
                shareDesc: "为股权投资跟投人提供更多退出机会和自主权利，让收益变得“可期”。",
                shareImg: "https://krplus-pic.b0.upaiyun.com/201512/24015952/nrxubj8zwabdopvu.png!120"
            };
            InitWeixin();
        }
        $scope.SharWeiXin();
    });
