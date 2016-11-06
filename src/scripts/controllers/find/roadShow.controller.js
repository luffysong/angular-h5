
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('RoadShowController', RoadShowController);

function RoadShowController(loading, $modal, $interval, $scope, $timeout) {
    var vm = this;
    vm.originDate = [];
    vm.originDateArray = [];
    vm.responseData = [];

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
        startDate.setDate(startDate.getDate() - (7 * 7));
        setDate(startDate);
        loadData();
    }

    function initSwiper() {
        // window.mySwiper.slideTo(window.mySwiper.slides.length - 1);
        scrollCallback();
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

        for (var j = 1; j <= 8; j++) {
            for (var i = 0; i < 7; i++) {
                var tempDate = new Date();
                tempDate = (i === 0 && j === 1 ? date : addDate(date, 1));
                vm.originDate.push({
                    date: angular.copy(tempDate),
                    day: tempDate.getDate(),
                    month: tempDate.getMonth() + 1,
                    year: tempDate.getFullYear(),
                    proCount: 1
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
        console.log(previousIndex + '-->' + activeIndex);

        //向左翻页,加载数据
        if (previousIndex - activeIndex === 1) {
            loadMore();
        }
    }

    function loadData() {
        vm.responseData = [
            {
                imgUrl:'https://krplus-pic.b0.upaiyun.com/201506/16221832/45f428fa90dffb37.png!200',
                name:'[人工智能产业高分论坛]项目推荐',
                fetchCode:'一系列巨额融资消息宣告：共的舒服舒服撒旦法。黄金时代很费劲书法家可使肌肤是的咖啡机死定了开发商,山东科技付款了时间付了款束带结发看来是大家发送的开放式的.撒旦法监考老师极度分裂快圣诞节饭.',
                startAt:'date2016115',
                proCount:'4',
            },
            {
                imgUrl:'https://pic.36krcnd.com/201511/18/295393180f6d4f10a0da640cbe2a9327.jpg!200',
                name:'[2016中国青年互联网创业大赛]金奖项目',
                fetchCode:'有分析人士指出，美图公司赴港上市的估值或超过50亿美元，这也意味着一旦美图上市，将成为继腾讯之后在香港的最大互联网IPO。从招股书透露的信息看，目前美图公司仍处于烧钱阶段，而且烧钱的规模惊人。在多位业内人士看来，美图将上市地点选在中国香港，或与国内资本市场的上市门槛有关。由于美图公司尚未盈利，目前其投资公司的资金存续期也到了一定阶段，在资金退出压力下，需要尽快寻求上市。招股书显示，美图移动端产品全球覆盖设备数超过10亿台。截至2015年10月份，美图的产品移动端月活跃用户2.7亿，日活跃用户5200万。美图秀秀移动端总用户数超过5亿、美拍总用户数超过1.7亿。可如此庞大的用户数量，却从未让美图公司盈利过。',
                startAt:'date2016114',
                proCount:'6',
            },
            {
                imgUrl:'https://krplus-pic.b0.upaiyun.com/201506/16221832/45f428fa90dffb37.png!200',
                name:'[人工智能产业高分论坛]项目推荐',
                fetchCode:'一系列巨额融资消息宣告：共的舒服舒服撒旦法。黄金时代很费劲书法家可使肌肤是的咖啡机死定了开发商,山东科技付款了时间付了款束带结发看来是大家发送的开放式的.撒旦法监考老师极度分裂快圣诞节饭.',
                startAt:'date2016113',
                proCount:'4',
            },
            {
                imgUrl:'https://pic.36krcnd.com/201511/18/295393180f6d4f10a0da640cbe2a9327.jpg!200',
                name:'[2016中国青年互联网创业大赛]金奖项目',
                fetchCode:'有分析人士指出，美图公司赴港上市的估值或超过50亿美元，这也意味着一旦美图上市，将成为继腾讯之后在香港的最大互联网IPO。从招股书透露的信息看，目前美图公司仍处于烧钱阶段，而且烧钱的规模惊人。在多位业内人士看来，美图将上市地点选在中国香港，或与国内资本市场的上市门槛有关。由于美图公司尚未盈利，目前其投资公司的资金存续期也到了一定阶段，在资金退出压力下，需要尽快寻求上市。招股书显示，美图移动端产品全球覆盖设备数超过10亿台。截至2015年10月份，美图的产品移动端月活跃用户2.7亿，日活跃用户5200万。美图秀秀移动端总用户数超过5亿、美拍总用户数超过1.7亿。可如此庞大的用户数量，却从未让美图公司盈利过。',
                startAt:'date2016112',
                proCount:'6',
            },
            {
                imgUrl:'https://krplus-pic.b0.upaiyun.com/201506/16221832/45f428fa90dffb37.png!200',
                name:'[人工智能产业高分论坛]项目推荐',
                fetchCode:'一系列巨额融资消息宣告：共的舒服舒服撒旦法。黄金时代很费劲书法家可使肌肤是的咖啡机死定了开发商,山东科技付款了时间付了款束带结发看来是大家发送的开放式的.撒旦法监考老师极度分裂快圣诞节饭.',
                startAt:'date2016111',
                proCount:'4',
            },
            {
                imgUrl:'https://pic.36krcnd.com/201511/18/295393180f6d4f10a0da640cbe2a9327.jpg!200',
                name:'[2016中国青年互联网创业大赛]金奖项目',
                fetchCode:'有分析人士指出，美图公司赴港上市的估值或超过50亿美元，这也意味着一旦美图上市，将成为继腾讯之后在香港的最大互联网IPO。从招股书透露的信息看，目前美图公司仍处于烧钱阶段，而且烧钱的规模惊人。在多位业内人士看来，美图将上市地点选在中国香港，或与国内资本市场的上市门槛有关。由于美图公司尚未盈利，目前其投资公司的资金存续期也到了一定阶段，在资金退出压力下，需要尽快寻求上市。招股书显示，美图移动端产品全球覆盖设备数超过10亿台。截至2015年10月份，美图的产品移动端月活跃用户2.7亿，日活跃用户5200万。美图秀秀移动端总用户数超过5亿、美拍总用户数超过1.7亿。可如此庞大的用户数量，却从未让美图公司盈利过。',
                startAt:'date20161031',
                proCount:'6',
            },
            {
                imgUrl:'https://krplus-pic.b0.upaiyun.com/201506/16221832/45f428fa90dffb37.png!200',
                name:'[人工智能产业高分论坛]项目推荐',
                fetchCode:'一系列巨额融资消息宣告：共的舒服舒服撒旦法。黄金时代很费劲书法家可使肌肤是的咖啡机死定了开发商,山东科技付款了时间付了款束带结发看来是大家发送的开放式的.撒旦法监考老师极度分裂快圣诞节饭.',
                startAt:'date20161030',
                proCount:'4',
            },
            {
                imgUrl:'https://pic.36krcnd.com/201511/18/295393180f6d4f10a0da640cbe2a9327.jpg!200',
                name:'[2016中国青年互联网创业大赛]金奖项目',
                fetchCode:'有分析人士指出，美图公司赴港上市的估值或超过50亿美元，这也意味着一旦美图上市，将成为继腾讯之后在香港的最大互联网IPO。从招股书透露的信息看，目前美图公司仍处于烧钱阶段，而且烧钱的规模惊人。在多位业内人士看来，美图将上市地点选在中国香港，或与国内资本市场的上市门槛有关。由于美图公司尚未盈利，目前其投资公司的资金存续期也到了一定阶段，在资金退出压力下，需要尽快寻求上市。招股书显示，美图移动端产品全球覆盖设备数超过10亿台。截至2015年10月份，美图的产品移动端月活跃用户2.7亿，日活跃用户5200万。美图秀秀移动端总用户数超过5亿、美拍总用户数超过1.7亿。可如此庞大的用户数量，却从未让美图公司盈利过。',
                startAt:'date20161029',
                proCount:'6',
            },
            {
                imgUrl:'https://pic.36krcnd.com/201511/18/295393180f6d4f10a0da640cbe2a9327.jpg!200',
                name:'[2016中国青年互联网创业大赛]金奖项目',
                fetchCode:'有分析人士指出，美图公司赴港上市的估值或超过50亿美元，这也意味着一旦美图上市，将成为继腾讯之后在香港的最大互联网IPO。从招股书透露的信息看，目前美图公司仍处于烧钱阶段，而且烧钱的规模惊人。在多位业内人士看来，美图将上市地点选在中国香港，或与国内资本市场的上市门槛有关。由于美图公司尚未盈利，目前其投资公司的资金存续期也到了一定阶段，在资金退出压力下，需要尽快寻求上市。招股书显示，美图移动端产品全球覆盖设备数超过10亿台。截至2015年10月份，美图的产品移动端月活跃用户2.7亿，日活跃用户5200万。美图秀秀移动端总用户数超过5亿、美拍总用户数超过1.7亿。可如此庞大的用户数量，却从未让美图公司盈利过。',
                startAt:'date20161028',
                proCount:'6',
            },
            {
                imgUrl:'https://krplus-pic.b0.upaiyun.com/201506/16221832/45f428fa90dffb37.png!200',
                name:'[人工智能产业高分论坛]项目推荐',
                fetchCode:'一系列巨额融资消息宣告：共的舒服舒服撒旦法。黄金时代很费劲书法家可使肌肤是的咖啡机死定了开发商,山东科技付款了时间付了款束带结发看来是大家发送的开放式的.撒旦法监考老师极度分裂快圣诞节饭.',
                startAt:'date20161027',
                proCount:'4',
            },
            {
                imgUrl:'https://pic.36krcnd.com/201511/18/295393180f6d4f10a0da640cbe2a9327.jpg!200',
                name:'[2016中国青年互联网创业大赛]金奖项目',
                fetchCode:'有分析人士指出，美图公司赴港上市的估值或超过50亿美元，这也意味着一旦美图上市，将成为继腾讯之后在香港的最大互联网IPO。从招股书透露的信息看，目前美图公司仍处于烧钱阶段，而且烧钱的规模惊人。在多位业内人士看来，美图将上市地点选在中国香港，或与国内资本市场的上市门槛有关。由于美图公司尚未盈利，目前其投资公司的资金存续期也到了一定阶段，在资金退出压力下，需要尽快寻求上市。招股书显示，美图移动端产品全球覆盖设备数超过10亿台。截至2015年10月份，美图的产品移动端月活跃用户2.7亿，日活跃用户5200万。美图秀秀移动端总用户数超过5亿、美拍总用户数超过1.7亿。可如此庞大的用户数量，却从未让美图公司盈利过。',
                startAt:'date20161026',
                proCount:'6',
            },
            {
                imgUrl:'https://krplus-pic.b0.upaiyun.com/201506/16221832/45f428fa90dffb37.png!200',
                name:'[人工智能产业高分论坛]项目推荐',
                fetchCode:'一系列巨额融资消息宣告：共的舒服舒服撒旦法。黄金时代很费劲书法家可使肌肤是的咖啡机死定了开发商,山东科技付款了时间付了款束带结发看来是大家发送的开放式的.撒旦法监考老师极度分裂快圣诞节饭.',
                startAt:'date20161025',
                proCount:'4',
            },
            {
                imgUrl:'https://pic.36krcnd.com/201511/18/295393180f6d4f10a0da640cbe2a9327.jpg!200',
                name:'[2016中国青年互联网创业大赛]金奖项目',
                fetchCode:'有分析人士指出，美图公司赴港上市的估值或超过50亿美元，这也意味着一旦美图上市，将成为继腾讯之后在香港的最大互联网IPO。从招股书透露的信息看，目前美图公司仍处于烧钱阶段，而且烧钱的规模惊人。在多位业内人士看来，美图将上市地点选在中国香港，或与国内资本市场的上市门槛有关。由于美图公司尚未盈利，目前其投资公司的资金存续期也到了一定阶段，在资金退出压力下，需要尽快寻求上市。招股书显示，美图移动端产品全球覆盖设备数超过10亿台。截至2015年10月份，美图的产品移动端月活跃用户2.7亿，日活跃用户5200万。美图秀秀移动端总用户数超过5亿、美拍总用户数超过1.7亿。可如此庞大的用户数量，却从未让美图公司盈利过。',
                startAt:'date20161024',
                proCount:'6',
            },
            {
                imgUrl:'https://krplus-pic.b0.upaiyun.com/201506/16221832/45f428fa90dffb37.png!200',
                name:'[人工智能产业高分论坛]项目推荐',
                fetchCode:'一系列巨额融资消息宣告：共的舒服舒服撒旦法。黄金时代很费劲书法家可使肌肤是的咖啡机死定了开发商,山东科技付款了时间付了款束带结发看来是大家发送的开放式的.撒旦法监考老师极度分裂快圣诞节饭.',
                startAt:'date20161023',
                proCount:'4',
            },
            {
                imgUrl:'https://pic.36krcnd.com/201511/18/295393180f6d4f10a0da640cbe2a9327.jpg!200',
                name:'[2016中国青年互联网创业大赛]金奖项目',
                fetchCode:'有分析人士指出，美图公司赴港上市的估值或超过50亿美元，这也意味着一旦美图上市，将成为继腾讯之后在香港的最大互联网IPO。从招股书透露的信息看，目前美图公司仍处于烧钱阶段，而且烧钱的规模惊人。在多位业内人士看来，美图将上市地点选在中国香港，或与国内资本市场的上市门槛有关。由于美图公司尚未盈利，目前其投资公司的资金存续期也到了一定阶段，在资金退出压力下，需要尽快寻求上市。招股书显示，美图移动端产品全球覆盖设备数超过10亿台。截至2015年10月份，美图的产品移动端月活跃用户2.7亿，日活跃用户5200万。美图秀秀移动端总用户数超过5亿、美拍总用户数超过1.7亿。可如此庞大的用户数量，却从未让美图公司盈利过。',
                startAt:'date20161022',
                proCount:'6',
            },
            {
                imgUrl:'https://pic.36krcnd.com/201511/18/295393180f6d4f10a0da640cbe2a9327.jpg!200',
                name:'[2016中国青年互联网创业大赛]金奖项目',
                fetchCode:'有分析人士指出，美图公司赴港上市的估值或超过50亿美元，这也意味着一旦美图上市，将成为继腾讯之后在香港的最大互联网IPO。从招股书透露的信息看，目前美图公司仍处于烧钱阶段，而且烧钱的规模惊人。在多位业内人士看来，美图将上市地点选在中国香港，或与国内资本市场的上市门槛有关。由于美图公司尚未盈利，目前其投资公司的资金存续期也到了一定阶段，在资金退出压力下，需要尽快寻求上市。招股书显示，美图移动端产品全球覆盖设备数超过10亿台。截至2015年10月份，美图的产品移动端月活跃用户2.7亿，日活跃用户5200万。美图秀秀移动端总用户数超过5亿、美拍总用户数超过1.7亿。可如此庞大的用户数量，却从未让美图公司盈利过。',
                startAt:'date2016924',
                proCount:'6',
            },
            {
                imgUrl:'https://krplus-pic.b0.upaiyun.com/201506/16221832/45f428fa90dffb37.png!200',
                name:'[人工智能产业高分论坛]项目推荐',
                fetchCode:'一系列巨额融资消息宣告：共的舒服舒服撒旦法。黄金时代很费劲书法家可使肌肤是的咖啡机死定了开发商,山东科技付款了时间付了款束带结发看来是大家发送的开放式的.撒旦法监考老师极度分裂快圣诞节饭.',
                startAt:'date2016923',
                proCount:'4',
            },
            {
                imgUrl:'https://pic.36krcnd.com/201511/18/295393180f6d4f10a0da640cbe2a9327.jpg!200',
                name:'[2016中国青年互联网创业大赛]金奖项目',
                fetchCode:'有分析人士指出，美图公司赴港上市的估值或超过50亿美元，这也意味着一旦美图上市，将成为继腾讯之后在香港的最大互联网IPO。从招股书透露的信息看，目前美图公司仍处于烧钱阶段，而且烧钱的规模惊人。在多位业内人士看来，美图将上市地点选在中国香港，或与国内资本市场的上市门槛有关。由于美图公司尚未盈利，目前其投资公司的资金存续期也到了一定阶段，在资金退出压力下，需要尽快寻求上市。招股书显示，美图移动端产品全球覆盖设备数超过10亿台。截至2015年10月份，美图的产品移动端月活跃用户2.7亿，日活跃用户5200万。美图秀秀移动端总用户数超过5亿、美拍总用户数超过1.7亿。可如此庞大的用户数量，却从未让美图公司盈利过。',
                startAt:'date2016922',
                proCount:'6',
            },

        ];
        vm.busy = false;
        vm.finish = false;
        vm.page = 1;
    }

    vm.month = 10;
    function loadMore() {
        console.log('loadMore');
        var temp = {
                imgUrl:'https://krplus-pic.b0.upaiyun.com/201506/16221832/45f428fa90dffb37.png!200',
                name:'新增',
                fetchCode:'宋飞飞水电费卡洛斯的吉林省极乐空间索拉卡等放假拉伸的解放路奇偶我结构我为机构我就饿哦个人感觉而过',
                startAt:'date2016115',
                proCount:'4',
            };
        for (var i = 10; i > 0; i--) {
            temp.time = 'date2016' + vm.month + i;
            vm.responseData.push(angular.copy(temp));
        }

        vm.month = vm.month - 1;
    }
}
