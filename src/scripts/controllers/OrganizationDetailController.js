/**
 * Controller Name: OrganizationDetailController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('OrganizationDetailController',
    function (OrganizationService, orgInfo, investments) {
        var vm = this;
        vm.investments = [];

        vm.isTop = isTop;
        vm.joinInvestorNames = joinInvestorNames;
        vm.loadMore = loadMore;
        active();
        function active() {
            vm.basic = orgInfo;
            document.title = orgInfo.nameAbbr + '机构介绍';
            pastInvestmentLoaded(investments);
        }

        function isTop() {
            return vm.basic.type === 'VIP';
        }

        function loadPastInvestment(page) {
            if (vm.loading) return;
            vm.loading = true;
            OrganizationService['past-investment'].get({
                id: orgInfo.id,
                page: page,
                pageSize: 20
            }).$promise
            .then(pastInvestmentLoaded)
            .catch(function pastInvestmentLoadFailed() {
                vm.loading = false;
            });
        }

        function pastInvestmentLoaded(data) {
            vm.page = data.page;
            vm.allLoaded = vm.page === data.totalPages;
            vm.loading = false;
            vm.investments = vm.investments.concat(data.data);
        }

        function joinInvestorNames(investors) {
            return investors.map(function joinName(investor) {
                return '<span>' + investor.name + '</span>';
            }).join(' ');
        }

        function loadMore() {
            loadPastInvestment(++vm.page);
        }
    }
);
