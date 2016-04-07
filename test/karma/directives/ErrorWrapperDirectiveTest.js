/**
 * Directive Name: errorWrapper
 */

describe('Directive --> errorWrapper', function () {
    var $compile, $rootScope, element;

    beforeEach(module('defaultApp.directive'));
    beforeEach(inject(function ($injector) {
        $compile = $injector.get('$compile');
        $rootScope = $injector.get('$rootScope');
        element = $compile("<div error-wrapper></div>")($rootScope);
    }));

    it('Input your test case name here', inject(function () {
        //write your truely test script here
        expect(false).to.equals(true);
    }));
});
