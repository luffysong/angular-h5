var angular = require('angular');
angular.module('defaultApp.controller')
  .controller('BestListController', BestListController);
function BestListController(loading, $stateParams, RongziService, $state, UserService, ErrorService, hybrid, $timeout) {
    var vm = this;
    vm.displayMore = displayMore;
    vm.page = 0;
    vm.prolist = [];
    vm.more = false;
    vm.like = like;
    vm.inApp = true;

    init();
    function init() {
        removeHeader();
        loading.hide('findLoading');
        initData();
        if (!hybrid.isInApp) {
            initLinkdme();
            vm.inApp = false;
        }
    }

    function removeHeader() {
        $('.common-header.J_commonHeaderWrapper').remove();
    }

    function initData() {
        var sendata = {
            page: vm.page + 1,
            pageSize:10,
        };
        RongziService.getProList(sendata)
            .then(function setProList(response) {
                    vm.prolist = vm.prolist.concat(response.data.data);
                    console.log(vm.prolist);
                    if (response.data.totalPages) {
                        vm.page = response.data.page || 0;
                        if (response.data.totalPages !== vm.page) {
                            vm.busy = false;
                        } else {
                            vm.finish = true;
                            vm.more = true;
                        }
                    }
                }).catch(fail);
    }

    function like(id) {
        if (!vm.inApp) {
            return;
        } else if (!UserService.getUID()) {
            window.location.href = 'https://passport.36kr.com/pages';
        } else {
            RongziService.like(id)
            .then(data => {
                console.log(data);
                angular.forEach(this.prolist, o => {
                  if (o.id === id) {
                    o.likes = data.data.curCount;
                    o.liked = true;
                  }
                });
            }).catch(fail);
        }
    }

    function initLinkdme() {
        var krdata = {};
        krdata.type = 'test';
        krdata.params =
        '{"openlink":"http://local.rongh5.36kr.com/#/rongzi/bestlist","currentRoom":"1","weburl":"http://local.rongh5.36kr.com/#/rongzi/bestlist"}';
        window.linkedme.init('3a89d6c23e6988e0e600d63ca3c70636',
        { type: 'test' }, function (err, res) {
                if (err) {
                    return;
                }

                window.linkedme.link(krdata, function (err, data) {
                        if (err) {
                            // 生成深度链接失败，返回错误对象err
                            console.log(err);
                        } else {
                            // 生成深度链接成功，深度链接可以通过data.url得到
                            $timeout(function () {
                                $('.like-btn').attr('href', data.url);
                            }, 1000);


                        }
                    }, false);
            });
    }

    function displayMore() {
        initData();
    }

    function initTitle(t) {
        document.title = t;
    }

    function fail(err) {
        ErrorService.alert(err.err.msg);
    }
}
