
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('RoadShowController', RoadShowController);

function RoadShowController(loading, $modal) {
    var vm = this;
    vm.originDate = [];
    vm.changeDate = 0;

    vm.responseData = [
        {
            logo:'https://krplus-pic.b0.upaiyun.com/201506/16221832/45f428fa90dffb37.png!200',
            name:'[人工智能产业高分论坛]项目推荐',
            brief:'一系列巨额融资消息宣告：共的舒服舒服撒旦法。黄金时代很费劲书法家可使肌肤是的咖啡机死定了开发商,山东科技付款了时间付了款束带结发看来是大家发送的开放式的.撒旦法监考老师极度分裂快圣诞节饭.',
            time:'10/10-10/11',
            num:'4',
        },
        {
            logo:'https://pic.36krcnd.com/201511/18/295393180f6d4f10a0da640cbe2a9327.jpg!200',
            name:'[2016中国青年互联网创业大赛]金奖项目',
            brief:'有分析人士指出，美图公司赴港上市的估值或超过50亿美元，这也意味着一旦美图上市，将成为继腾讯之后在香港的最大互联网IPO。从招股书透露的信息看，目前美图公司仍处于烧钱阶段，而且烧钱的规模惊人。在多位业内人士看来，美图将上市地点选在中国香港，或与国内资本市场的上市门槛有关。由于美图公司尚未盈利，目前其投资公司的资金存续期也到了一定阶段，在资金退出压力下，需要尽快寻求上市。招股书显示，美图移动端产品全球覆盖设备数超过10亿台。截至2015年10月份，美图的产品移动端月活跃用户2.7亿，日活跃用户5200万。美图秀秀移动端总用户数超过5亿、美拍总用户数超过1.7亿。可如此庞大的用户数量，却从未让美图公司盈利过。',
            time:'10/10-10/12',
            num:'6',
        },

    ];

    //当前选中日期
    vm.selectedDate;

    //上一周
    vm.dateDel = dateDel;

    //下一周
    vm.dateAdd = dateAdd;

    //选中日期
    vm.setActive = setActive;

    //更多
    vm.more = more;

    init();

    function init() {
        document.title = '路演日历';
        loading.hide('demos');
        vm.selectedDate = angular.copy(new Date());
        setDate(new Date());
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

        for (var i = 0; i < 7; i++) {
            var tempDate = new Date();
            tempDate = (i === 0 ? date : addDate(date, 1));
            vm.originDate.push({
                date: angular.copy(tempDate),
                day: tempDate.getDate(),
                num: 1
            });
        }

        //标记今天和选中
        for (var j = 0; j < 7; j++) {
            if (formatDate(vm.originDate[j].date) === formatDate(vm.selectedDate)) {
                vm.originDate[j].active = true;
            }

            if (formatDate(vm.originDate[j].date) === formatDate(new Date())) {
                vm.originDate[j].today = true;
            }
        }
    }

    //日期格式化
    function formatDate(date) {
        var year = date.getFullYear() + '-';
        var month = (date.getMonth() + 1) + '-';
        var day = date.getDate();
        return year + month + day;
    }

    function setActive(item) {
        vm.selectedDate = angular.copy(item.date);
        for (var i = 0; i < vm.originDate.length; i++) {
            vm.originDate[i].active = false;
        }

        item.active = true;
    }

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

        function open() {
            if (hybrid.isInApp) {
                hybrid.open(path);
            }
        }

        window.addEventListener('touchmove', preventDefault, false);
    }

    function preventDefault() {
        event.preventDefault();
    }

}
