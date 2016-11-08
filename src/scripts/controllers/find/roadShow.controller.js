
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('RoadShowController', RoadShowController);

function RoadShowController(loading, $modal, $interval, $scope, $timeout, FindService, hybrid) {
    var vm = this;
    vm.originDate = [];
    vm.originDateArray = [];
    vm.responseData = [];
    vm.busy = true;

    //当前选中日期
    vm.selectedDate;

    //上一周
    vm.dateDel = dateDel;

    //下一周
    vm.dateAdd = dateAdd;

    vm.scrollCallback = scrollCallback;
    vm.onSlideChangeEnd = onSlideChangeEnd;
    vm.loadMore = loadMore;

    //选中日期
    // vm.setActive = setActive;

    //更多
    vm.more = more;

    init();

    //页面load后回调
    $scope.$on('$viewContentLoaded', function () {
        if (!window.mySwiper) {
            $timeout(initSwiper, 1000);
        }

    });

    function init() {
        document.title = '路演日历';
        loading.hide('demos');
        vm.selectedDate = angular.copy(new Date());

        var startDate = new Date();
        startDate.setDate(startDate.getDate() - (7 * 11));
        setDate(startDate);
        loadData();
    }

    function initSwiper() {
        // window.mySwiper.slideTo(window.mySwiper.slides.length - 1);
        scrollCallback();
        vm.busy = false;
    }

    function dateDel() {
        setDate(addDate(vm.currentFirstDate, -7));
    }

    function dateAdd() {
        setDate(addDate(vm.currentFirstDate, 7));
    }

    function addDate(date, n) {
        date.setDate(date.getDate() + n);
        return date;
    }

    function setDate(date) {
        vm.originDate = [];
        var week = date.getDay();
        date = addDate(date, week * -1);
        vm.currentFirstDate = new Date(date);

        for (var j = 1; j <= 12; j++) {
            for (var i = 0; i < 7; i++) {
                var tempDate = new Date();
                tempDate = (i === 0 && j === 1 ? date : addDate(date, 1));
                vm.originDate.push({
                    date: angular.copy(tempDate),
                    day: tempDate.getDate(),
                    month: tempDate.getMonth() + 1,
                    year: tempDate.getFullYear(),
                    num: 0
                });
            }

            //标记今天和选中
            for (var k = 0; k < 7; k++) {
                if (formatDate(vm.originDate[k].date) === formatDate(new Date())) {
                    vm.originDate[k].today = true;
                }
            }

            vm.originDateArray.push(vm.originDate);
            vm.originDate = [];
        }
    }

    //日期格式化
    function formatDate(date) {
        var year = date.getFullYear() + '-';
        var month = (date.getMonth() + 1) + '-';
        var day = date.getDate();
        return year + month + day;
    }

    // function setActive(item) {
    //     vm.selectedDate = angular.copy(item.date);
    //     for (var i = 0; i < vm.originDate.length; i++) {
    //         vm.originDate[i].active = false;
    //     }
    //
    //     item.active = true;
    // }

    function more(item, e) {
        e.preventDefault();
        $modal.open({
            templateUrl: 'templates/find/nativeAlert.html',
            windowClass: 'nativeAlert_wrap',
            controller: modalController,
            controllerAs: 'vm',
            resolve: {
                obj: function () {
                    return item;
                }
            }
        }).result.then(allowScroll).catch(allowScroll);
    }

    function allowScroll() {
        window.removeEventListener('touchmove', preventDefault, false);
    }

    modalController.$inject = ['$modalInstance', 'obj', 'hybrid'];
    function modalController($modalInstance, obj, hybrid) {

        var vm = this;
        vm.item = obj;
        vm.cancel = cancel;
        vm.open = open;

        function cancel() {
            $modalInstance.dismiss();
        }

        function open(path) {
            if (hybrid.isInApp) {
                hybrid.open(path);
            }
        }

        window.addEventListener('touchmove', preventDefault, false);
    }

    function preventDefault() {
        event.preventDefault();
    }

    function scrollCallback() {

        var target = $('a.active');
        if (!target.length) {
            return;
        }

        if (!!window.interval) {
            $interval.cancel(window.interval);
        }

        window.interval = $interval(function () {
            if (!target.length) {
                return;
            }

            if (target.offset().left < 0) {
                window.mySwiper.slidePrev();
                target = $('a.active');
            } else if (target.offset().left > screen.width) {
                window.mySwiper.slideNext();
                target = $('a.active');
            } else {
                $interval.cancel(window.interval);
            }
        }, 1000, 10);

    }

    function onSlideChangeEnd(previousIndex, activeIndex) {
        // console.log(previousIndex + '-->' + activeIndex);

        //向左翻页,加载数据
        if (previousIndex - activeIndex === 1) {
            loadMore();
        }
    }

    function loadData() {

        var sendData = {
            date: '',
        };
        FindService.getCalendarList(sendData)
            .then(function (response) {
                if (vm.responseData) {
                    vm.responseData = vm.responseData.concat(response.data.data);
                } else {
                    vm.responseData = response.data.data;
                }

                vm.busy = false;
                vm.lastSat = response.data.lastSat;
                vm.nextSat = response.data.nextSat;
            });

        // initPoint();
    }

    function loadMore() {
        // if (vm.busy)return;
        // vm.busy = true;
        //
        // var sendData = {
        //     date: moment(vm.currentFirstDate).format('YYYY-MM-DD HH:mm:ss'),
        // };
        // FindService.getCalendarList(sendData)
        //     .then(function (response) {
        //         if (vm.responseData) {
        //             vm.responseData = vm.responseData.concat(response.data.data);
        //         } else {
        //             vm.responseData = response.data;
        //         }
        //
        //         vm.busy = false;
        //     });

        // initPoint();
    }

    // function initPoint() {
    //     for(var i=0;i < vm.originDateArray.length;i++){
    //         for(var j = 0; j < 7 ; j++){
    //             if (vm.originDateArray[i][j].id === )
    //         }
    //     }
    // }

}
