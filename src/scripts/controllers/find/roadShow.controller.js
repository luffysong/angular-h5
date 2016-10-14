
var  angular = require('angular');
angular.module('defaultApp.controller')
    .controller('RoadShowController', RoadShowController);

function RoadShowController(loading) {
    var vm = this;
    vm.originDate = [];
    vm.changeDate = 0;

    //当前选中日期
    vm.selectedDate;

    //上一周
    vm.dateDel = dateDel;

    //下一周
    vm.dateAdd = dateAdd;

    //选中日期
    vm.setActive = setActive;

    init();

    function init() {
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

}
