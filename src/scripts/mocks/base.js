MOCKMODE_ON = true;
angular.module('defaultApp.mocks', ['ngMockE2E']).config(function($provide) {
    $provide.decorator('$httpBackend', function($delegate) {
        var proxy = function(method, url, data, callback, headers) {
            var interceptor = function() {
                var _this = this,
                    _arguments = arguments;
                setTimeout(function() {
                    callback.apply(_this, _arguments);
                }, 1000);
            };
            return $delegate.call(this, method, url, data, interceptor, headers);
        };
        for(var key in $delegate) {
            proxy[key] = $delegate[key];
        }
        return proxy;
    });
}).run([
    "$httpBackend",
    function ($httpBackend) {
        console.log("Base mock running");

        $httpBackend.whenGET(/templates\//).passThrough();
        $httpBackend.whenPOST("/api/upload/form-api").passThrough();
        $httpBackend.whenPOST(/upyun/).passThrough();
        // $httpBackend.whenGET(/.*company.*/).passThrough();

        return;


        $httpBackend.whenPOST(/.*upyun.*/).passThrough();
        $httpBackend.whenGET(/.*api.*/).passThrough();
        $httpBackend.whenPOST(/.*api.*/).passThrough();
        $httpBackend.whenPUT(/.*api.*/).passThrough();
        $httpBackend.whenDELETE(/.*api.*/).passThrough();
    }
]);
