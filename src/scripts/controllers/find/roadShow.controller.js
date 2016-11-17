
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
        // console.log('ps-y-reach-start');
        $('.img-fixed').hide();
    });

    $(document).on('ps-scroll-down', function () {
        $('.arrowRight').show();
        $('.img-fixed').show();
        checkSwiper();
    });

    // $(document).on('ps-y-reach-end', function () {
    //     console.log('ps-y-reach-end');
    // });

    $(document).on('ps-scroll-up', function () {
        $('.arrowLeft').show();
        checkSwiper();
    });

    $(document).on('ps-scroll-y', function () {
        scrollCallback();
    });

    window.onscroll = function () {
        if ($(window).scrollTop()) {
            $(window).scrollTop(0);
        }
    };

    document.addEventListener('touchmove', function (e) {
        e.preventDefault();
    });

    function init() {
        $('html').css('overflow', 'hidden');
        $('body').css('overflow', 'hidden');
        document.title = '路演日历';
        $('head').append('<meta name="format-detection" content="telephone=no" />');
        loading.hide('findLoading');
        vm.selectedDate = angular.copy(new Date());
        loadData();
        initWeixin();
    }

    function initWeixin() {
        window.WEIXINSHARE = {
            shareTitle: '路演日历',
            shareUrl: window.location.href,
            shareImg: 'https://krplus-cdn.b0.upaiyun.com/m/images/8fba4777.investor-app.png',
            shareDesc: '来「36氪创投助手」，发现最新最热优质项目！',
            shareButton: 'hide'
        };
        var obj = {};
        window.InitWeixin(obj);
    }

    function arrow(value) {
        vm.topArrow = true;
        if (value === 'left') {
            window.mySwiper.slidePrev();
        }

        if (value === 'right') {
            window.mySwiper.slideNext();
        }

    }

    function initSwiper() {
        vm.topArrow = false;
        scrollCallback();
        vm.busy = false;
        $timeout(function () {
            $('.arrowRight').show();
            $('.arrowLeft').show();
            window.mySwiper.unlockSwipeToNext();
            window.mySwiper.unlockSwipeToPrev();
            var date;
            for (var i = 0; i < vm.responseData.length; i++) {
                date = vm.responseData[i].startAt;
                var sunday = moment().day(7).format('YYYYMMDD');
                if (date / 1000 > parseInt(moment(sunday).format('X'))) {
                    $('.img-fixed').show();
                    continue;
                } else {
                    var targetId = 'date' + moment(date).format('YYYY') + moment(date).format('MM') + moment(date).format('DD');
                    $('#contentScroll').scrollTo($('#' + targetId)[0], 91, 300);
                    if (i === 0) {
                        $('.img-fixed').hide();
                    }

                    break;
                }
            }

            $timeout(scrollCallback, 1000);
            $timeout(checkSwiper, 1200);
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
            window.mySwiper.slideTo(window.mySwiper.activeIndex - moveIndex - 1, 400, false);
            vm.moving = true;
            $timeout(function () {
                checkSwiper();
                vm.moving = false;
            }, 400);
        } else {
            moveIndex = parseInt(left / screen.width);
            if (moveIndex) {
                window.mySwiper.slideTo(window.mySwiper.activeIndex + moveIndex, 400, false);
                vm.moving = true;
                $timeout(function () {
                    checkSwiper();
                    vm.moving = false;
                }, 400);
            }
        }
    }

    function onTransitionStart() {
        vm.slideChange = true;
        vm.topArrow = true;

        // console.log('onTransitionStart:' + vm.slideChange);
        // console.log('topArrow=' + vm.topArrow);
    }

    function onTransitionEnd(previousIndex, activeIndex) {

        // console.log(previousIndex + '-->' + activeIndex);
        // console.log('topArrow=' + vm.topArrow);

        vm.slideChange = false;

        // console.log('onTransitionEnd:' + vm.slideChange);

        checkSwiper();

        if (!vm.topArrow) {
            return;
        }

        var targetArray;
        var targetId;

        //翻页,加载数据

        // console.log('翻页');
        $('.active').removeClass('active');
        targetArray = vm.originDateArray[activeIndex];
        for (var i = 6; i >= 0; i--) {
            if (targetArray[i].num) {
                targetId = 'date' + targetArray[i].year + targetArray[i].month + targetArray[i].day;
                $timeout(function () {
                    $('#contentScroll').scrollTo($('#' + targetId)[0], 91, 300);
                    if ($('#' + targetId).offset().top === 91) {
                        $('a[href=#' + targetId + ']').addClass('active');
                    }

                    $timeout(function () {
                        vm.topArrow = false;
                        if ($('#contentScroll')[0].scrollTop) {
                            $('.img-fixed').show();
                        } else {
                            $('.img-fixed').hide();
                        }

                        // console.log('time out: topArrow=' + vm.topArrow);
                    }, 500);
                }, 100);

                // console.log('翻页--触发:' + targetId);
                break;
            }
        }

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

                vm.ts = response.data.ts;
                vm.hasMore  = response.data.data.length;
                vm.hasInit = true;
                initPoint();
                vm.busy = false;
            });

    }

    function loadMore() {
        if (vm.busy)return;
        vm.busy = true;

        if (!vm.ts)return;

        var sendData = {
            ts: vm.ts,
            pageSize: 30
        };
        FindService.getCalendarList(sendData)
            .then(function (response) {
                vm.responseData = vm.responseData.concat(response.data.data);

                vm.ts = response.data.ts;
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

        //6个月,24周
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

                    //标记最新一条数据所在周
                    if (!vm.newDataWeekIndex) {
                        vm.newDataWeekIndex = index;
                    }

                    //标记最旧一条数据所在周
                    vm.oldDataWeekIndex = index;

                    break;
                }
            }
        }
    }

    function backTop() {

        var date = vm.responseData[0].startAt;
        var targetId = 'date' + moment(date).format('YYYY') + moment(date).format('MM') + moment(date).format('DD');
        $('#contentScroll').scrollTo($('#' + targetId)[0], 91, 300);
        $('.img-fixed').hide();
        $timeout(scrollCallback, 500);
    }

    function noDataClick(item) {
        if (!item.num) {
            item.active = true;
            $('.null_today').fadeIn();
            $timeout(function () {
                $('.null_today').fadeOut();
            }, 3000);
        }

    }

    function checkSwiper() {

        //最后一屏判断
        if (window.mySwiper && vm.newDataWeekIndex && (window.mySwiper.activeIndex === vm.newDataWeekIndex - 1)) {
            $('.arrowRight').hide();
            if (window.mySwiper) {
                $timeout(function () {
                    window.mySwiper.lockSwipeToNext();
                }, 100);
            }
        } else if (window.mySwiper) {
            window.mySwiper.unlockSwipeToNext();
            $('.arrowRight').show();
        }

        //第一屏判断
        if (window.mySwiper && vm.oldDataWeekIndex && (window.mySwiper.activeIndex === vm.oldDataWeekIndex - 1)) {
            if (!vm.busy && vm.hasMore) {
                loadMore();
            } else {
                $('.arrowLeft').hide();
                if (window.mySwiper) {
                    $timeout(function () {
                        window.mySwiper.lockSwipeToPrev();
                    }, 100);
                }
            }
        } else if (window.mySwiper) {
            window.mySwiper.unlockSwipeToPrev();
            $('.arrowLeft').show();
        }
    }

}
