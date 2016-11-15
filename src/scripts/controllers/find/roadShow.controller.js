
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
    vm.onTransitionStart = onTransitionStart;
    vm.onTransitionEnd = onTransitionEnd;
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

    $(document).on('ps-y-reach-start', function () {
        console.log('ps-y-reach-start');
        $('.arrowRight').hide();
        $('.img-fixed').hide();
    });

    $(document).on('ps-scroll-down', function () {
        $('.arrowRight').show();
        $('.img-fixed').show();
    });

    $(document).on('ps-y-reach-end', function () {
        console.log('ps-y-reach-end');
        $('.arrowLeft').hide();
    });

    $(document).on('ps-scroll-up', function () {
        $('.arrowLeft').show();
    });

    function init() {
        document.title = '路演日历';
        $('head').append('<meta name="format-detection" content="telephone=no" />');
        loading.hide('findLoading');
        vm.selectedDate = angular.copy(new Date());
        loadData();

    }

    function arrow(value) {
        vm.topArrow = true;
        if (value === 'left') {
            window.mySwiper.slidePrev();
        }

        if (value === 'right') {

            // //最后 一页才重新请求数据,其他页时正常翻页
            // if (window.mySwiper.slides.length - 1 === window.mySwiper.activeIndex) {
            //     loadData(vm.nextSat);
            // } else {
            //     window.mySwiper.slideNext();
            // }

            window.mySwiper.slideNext();
        }

    }

    function initSwiper() {
        scrollCallback();
        vm.busy = false;
        $timeout(function () {
            var date;
            for (var i = 0; i < vm.responseData.length; i++) {
                date = vm.responseData[i].startAt;
                if (date / 1000 > parseInt(moment().format('X'))) {
                    continue;
                } else {
                    var targetId = 'date' + moment(date).format('YYYY') + moment(date).format('MM') + moment(date).format('DD');
                    $('#contentScroll').scrollTo($('#' + targetId)[0], 91, 300);
                    console.log(targetId);
                    break;
                }
            }

            $timeout(scrollCallback, 500);
        }, 1000);
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
        for (var j = 1; j <= 24; j++) {
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

    modalController.$inject = ['$modalInstance', 'obj'];
    function modalController($modalInstance, obj) {

        var vm = this;
        vm.item = obj;
        vm.cancel = cancel;
        vm.ktm_source = 'calendar_more';

        function cancel() {
            $modalInstance.dismiss();
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

        //
        // //是否到达底部
        // if ($('#contentScroll').scrollTop() - ($(document).height() - $(window).height()) > -30) {
        //     $('.arrowLeft').hide();
        // } else {
        //     $('.arrowLeft').show();
        // }

    }

    function onTransitionStart() {
        vm.slideChange = true;
        vm.topArrow = true;

        console.log('onTransitionStart:' + vm.slideChange);
    }

    function onTransitionEnd(previousIndex, activeIndex) {
        // console.log(previousIndex + '-->' + activeIndex);

        vm.slideChange = false;

        console.log('onTransitionEnd:' + vm.slideChange);

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
                    $('#contentScroll').scrollTo($('#' + targetId)[0], 91, 300);
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
                    $('#contentScroll').scrollTo($('#' + targetId)[0], 91, 300);
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
            ts: time || 0,
            pageSize: 30
        };
        FindService.getCalendarList(sendData)
            .then(function (response) {
                vm.responseData = response.data.data;
                vm.busy = false;

                // vm.lastSat = response.data.lastSat;
                // vm.nextSat = response.data.nextSat;
                // vm.hasMore = response.data.hasMore;
                // vm.hasNextWeek = response.data.hasNextWeek;
                vm.ts = response.data.ts;
                vm.hasMore  = response.data.data.length;
                vm.hasInit = true;
                initPoint();
            });

    }

    function loadMore() {
        if (vm.busy)return;
        vm.busy = true;

        var sendData = {
            ts: vm.ts,
            pageSize: 30
        };
        FindService.getCalendarList(sendData)
            .then(function (response) {
                vm.responseData = vm.responseData.concat(response.data.data);

                // vm.lastSat = response.data.lastSat;
                // vm.hasMore = response.data.hasMore;

                vm.hasMore  = response.data.data.length;
                if (!vm.hasMore) {
                    vm.busy = true;
                    vm.ts = response.data.ts;
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

        // $('html, body').animate({
        //     scrollTop: 0
        // }, 300);
        // window.mySwiper.slideTo(window.mySwiper.slides.length - 1);

        var date = vm.responseData[0].startAt;
        var targetId = 'date' + moment(date).format('YYYY') + moment(date).format('MM') + moment(date).format('DD');
        $('#contentScroll').scrollTo($('#' + targetId)[0], 91, 300);
        $('.img-fixed').hide();
    }

    function noDataClick(item) {
        if (!item.num) {
            // $('.active').removeClass('active');
            item.active = true;
            $('.null_today').fadeIn();
            $timeout(function () {
                $('.null_today').fadeOut();

                // $('.active').removeClass('active');
            }, 3000);
        } else {
            item.active = true;
        }

    }

}
