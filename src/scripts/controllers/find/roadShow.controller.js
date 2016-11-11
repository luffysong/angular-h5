
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('RoadShowController', RoadShowController);

function RoadShowController(loading, $modal, $interval, $scope, $timeout, FindService, $document) {
    var vm = this;
    vm.originDate = [];
    vm.originDateArray = [];
    vm.responseData = [];
    vm.busy = true;
    vm.hasMore = true;
    vm.isLastSwiper = true;

    //当前选中日期
    vm.selectedDate;

    //上一周
    vm.dateDel = dateDel;

    //下一周
    vm.dateAdd = dateAdd;

    vm.scrollCallback = scrollCallback;
    vm.onSlideChangeStart = onSlideChangeStart;
    vm.onSlideChangeEnd = onSlideChangeEnd;
    vm.loadMore = loadMore;
    vm.backTop = backTop;
    vm.noDataClick = noDataClick;

    //选中日期
    // vm.setActive = setActive;

    //更多
    vm.more = more;
    vm.arrow = arrow;

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
        loadData();

    }

    function arrow(value) {
        vm.topArrow = true;
        if (value === 'left') {
            window.mySwiper.slidePrev();
        }

        if (value === 'right') {

            //最后 一页才重新请求数据,其他页时正常翻页
            if (window.mySwiper.slides.length - 1 === window.mySwiper.activeIndex) {
                loadData(vm.nextSat);
            } else {
                window.mySwiper.slideNext();
            }
        }

    }

    function initSwiper() {
        // window.mySwiper.slideTo(window.mySwiper.slides.length - 1);
        window.mySwiper.update();
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
        vm.originDateArray = [];
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

    function more(item, e) {
        e.preventDefault();
        e.stopPropagation();
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
        });
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

        function open() {
            var path = 'projectsSet/' + obj.id + '?ktm_source=roadShow';
            if (hybrid.isInApp) {
                hybrid.open(path);
                $modalInstance.dismiss();
            }
        }
    }

    function scrollCallback() {

        if (vm.slideChange) {
            return;
        }

        if (vm.topArrow) {
            return;
        }

        if (vm.moving) {
            return;
        }

        var target = $('a.active');
        if (!target.length) {
            return;
        }

        if (!!window.interval) {
            $interval.cancel(window.interval);
        }

        if (!target.length) {
            return;
        }

        var left = target.offset().left;
        var moveIndex;

        if (left < 0) {
            left = window.Math.abs(left);
            moveIndex = parseInt(left / screen.width);
            window.mySwiper.slideTo(window.mySwiper.activeIndex - moveIndex - 1, 500, false);
            vm.moving = true;
            $timeout(function () {
                vm.moving = false;
            }, 500);
        } else {
            moveIndex = parseInt(left / screen.width);
            if (moveIndex) {
                window.mySwiper.slideTo(window.mySwiper.activeIndex + moveIndex, 500, false);
                vm.moving = true;
                $timeout(function () {
                    vm.moving = false;
                }, 500);
            }
        }

    }

    function onSlideChangeStart() {
        vm.slideChange = true;
        vm.topArrow = true;

        // console.log('vm.slideChange:' + vm.slideChange);
    }

    function onSlideChangeEnd(previousIndex, activeIndex) {
        // console.log(previousIndex + '-->' + activeIndex);

        vm.slideChange = false;

        // console.log('vm.slideChange:' + vm.slideChange);

        //最后一屏判断
        if (window.mySwiper && (activeIndex === window.mySwiper.slides.length - 1)) {
            vm.isLastSwiper = true;
        } else {
            vm.isLastSwiper = false;
        }

        if (!vm.topArrow) {
            return;
        }

        var targetArray;
        var targetId;

        //向左翻页,加载数据
        if (previousIndex - activeIndex === 1) {
            $('.active').removeClass('active');

            // loadMore();
            targetArray = vm.originDateArray[activeIndex];
            for (var i = 6; i >= 0; i--) {
                if (targetArray[i].num) {
                    targetId = 'date' + targetArray[i].year + targetArray[i].month + targetArray[i].day;
                    $document.scrollTo($('#' + targetId)[0], 91, 300);
                    break;
                }
            }
        }

        //向右翻页
        if (activeIndex - previousIndex === 1) {
            $('.active').removeClass('active');
            targetArray = vm.originDateArray[activeIndex];
            for (var k = 6; k >= 0; k--) {
                if (targetArray[k].num) {
                    targetId = 'date' + targetArray[k].year + targetArray[k].month + targetArray[k].day;
                    $document.scrollTo($('#' + targetId)[0], 91, 300);
                    break;
                }
            }
        }

        $timeout(function () {
            vm.topArrow = false;
        }, 1000);

    }

    function loadData(time) {

        var startDate = time ? new Date(time) : new Date();
        startDate.setDate(startDate.getDate() - (7 * 11));
        setDate(startDate);

        if (!window.mySwiper) {
            $timeout(initSwiper, 1000);
        }

        var sendData = {
            date: time ? moment(time).format('YYYY-MM-DD HH:mm:ss') : '',
        };
        FindService.getCalendarList(sendData)
            .then(function (response) {
                vm.responseData = response.data.data;
                vm.busy = false;
                vm.lastSat = response.data.lastSat;
                vm.nextSat = response.data.nextSat;
                vm.hasMore = response.data.hasMore;
                vm.hasNextWeek = response.data.hasNextWeek;
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

        //3个月,12周
        for (var i = vm.originDateArray.length; i > 0; i--) {
            setPoint(i);
        }
    }

    function setPoint(index) {
        var arrayTemp = vm.originDateArray[index - 1];
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
        vm.moving = 1;
        $('html, body').animate({
            scrollTop: 0
        }, 300);
        window.mySwiper.slideTo(window.mySwiper.slides.length - 1);
        $timeout(function () {
            vm.moving = false;
        }, 400);
    }

    function noDataClick(item) {
        if (!item.num) {
            $('.active').removeClass('active');
            item.active = true;
            $('.null_today').fadeIn();
            $timeout(function () {
                $('.null_today').fadeOut();
                $('.active').removeClass('active');
            }, 3000);
        } else {
            item.active = true;
        }

    }

}
