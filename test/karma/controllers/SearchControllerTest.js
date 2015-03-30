/**
 * Controller Name: SearchController
 */

describe('Controller --> SearchController', function () {
    var $scope;

    beforeEach(module('defaultApp.controller'));
    beforeEach(inject(function ($injector, $controller) {
        $scope = $injector.get('$rootScope');
        $controller('SearchController', {'$scope': $scope});
    }));

    it('Input your test case name here', function () {
        //write your truely test script here
        expect(false).to.equals(true);
    });
});