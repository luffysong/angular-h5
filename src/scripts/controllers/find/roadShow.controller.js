
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('RoadShowController', RoadShowController);

function RoadShowController(loading, $modal, $interval, $scope, $timeout, FindService, hybrid) {
    var vm = this;
    vm.originDate = [];
    vm.originDateArray = [];
    vm.responseData = [];
    vm.busy = true;
    vm.hasMore = true;

    //当前选中日期
    vm.selectedDate;

    //上一周
    vm.dateDel = dateDel;

    //下一周
    vm.dateAdd = dateAdd;

    vm.scrollCallback = scrollCallback;
    vm.onSlideChangeEnd = onSlideChangeEnd;
    vm.loadMore = loadMore;
    vm.backTop = backTop;
    vm.noDataClick = noDataClick;

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
                    dayInt: parseInt(moment(date).format('DD')),
                    day: moment(date).format('DD'),
                    month: moment(date).format('MM'),
                    year: moment(date).format('YYYY'),
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
        return moment(date).format('YYYY-MM-DD');
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
                vm.hasMore = response.data.hasMore;
                initPoint();
            });

    }

    function loadMore() {
        if (vm.busy)return;
        vm.busy = true;

        var sendData = {
            date: moment(vm.lastSat).format('YYYY-MM-DD HH:mm:ss'),
        };
        FindService.getCalendarList(sendData)
            .then(function (response) {
                vm.responseData = vm.responseData.concat(response.data.data);

                vm.lastSat = response.data.lastSat;
                vm.nextSat = response.data.nextSat;
                vm.hasMore = response.data.hasMore;
                if (!vm.hasMore) {
                    vm.busy = true;
                } else {
                    vm.busy = false;
                }

                initPoint();
            });
    }

    function initPoint() {
        for (var i = vm.originDateArray.length; i > 0; i--) {
            var arrayTemp = vm.originDateArray[i - 1];
            if (formatDate(arrayTemp[6].date) === formatDate(vm.lastSat)) {
                setPoint(i);
                break;
            }
        }
    }

    function setPoint(index) {
        var arrayTemp = vm.originDateArray[index];
        var obj;
        var keyDate = 'date';
        var keyNum = 'num';
        for (var i = 0; i < 7; i++) {
            obj = arrayTemp[i];
            for (var j = 0; j < vm.responseData.length; j++) {
                if (formatDate(obj[keyDate]) === formatDate(vm.responseData[j].startAt)) {
                    obj[keyNum] = 1;
                    break;
                }
            }
        }
    }

    function backTop() {
        $('html, body').animate({
            scrollTop: 0
        }, 300);
    }

    function noDataClick(item) {
        $('.active').removeClass('active');
        item.active = true;
        $('.null_today').fadeIn();
        $timeout(function () {
            $('.null_today').fadeOut();
            $('.active').removeClass('active');
        }, 3000);
    }

}
