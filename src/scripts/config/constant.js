angular.module('defaultApp').constant('yearOptions', (function() {
    var years = [];
    var now = new Date().getFullYear() - 0;

    for (var i = now; i >= 1985; i--) {
        years.push(i + '');
    }

    return years;
})()).constant('monthOptions', (function() {
    var res = [];

    for (var i = 1; i <= 12; i++) {
        res.push(i + '');
    }

    return res;
})());
