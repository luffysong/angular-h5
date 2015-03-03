/**
 * Service Name: MoneyUnit
 */

describe('Filter --> MoneyUnit', function () {
    var filter;

    beforeEach(module('defaultApp.filter'));
    beforeEach(inject(function ($injector) {
        var $filter = $injector.get('$filter');
        filter = $filter('MoneyUnit');
    }));

    it('Input your test case name here', function () {
        expect(filter('something')).to.equals('some thing');
    });
});

