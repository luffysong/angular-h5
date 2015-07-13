/**
 * Service Name: AndroidUploadService
 */

describe('Service --> AndroidUploadService', function () {
    var AndroidUploadService, $httpBackend;

    beforeEach(module('defaultApp.service'));
    beforeEach(inject(function ($injector) {
        AndroidUploadService = $injector.get('AndroidUploadService');
        $httpBackend = $injector.get('$httpBackend');
    }));

    it('Input your test case name here', function () {
        $httpBackend.expectDELETE('/path/to/server').respond(201, {message: 'some msg ...'});
            AndroidUploadService.someMethod().then(function (data) {
            expect(data.message).to.equals('some msg ...');
        });
        $httpBackend.flush();
    });
});
