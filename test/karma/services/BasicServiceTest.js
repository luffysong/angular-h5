/**
 * Service Name: BasicService
 */

describe('Service --> BasicService', function () {
    var $httpBackend, BasicService;
    var baseInst;

    beforeEach(module('defaultApp.service'));
    beforeEach(inject(function ($injector) {
        BasicService = $injector.get('BasicService');
        $httpBackend = $injector.get('$httpBackend');
        baseInst = BasicService("/api/basic/:id/:type/:itemId");
    }));

    it('传入url pattern 创建BasicService实例，具有CRUD对应的基本方法\n', function () {
        expect(baseInst.query).not.to.equals(undefined);
        expect(baseInst.save).not.to.equals(undefined);
        expect(baseInst.get).not.to.equals(undefined);
        expect(baseInst.update).not.to.equals(undefined);
        expect(baseInst.remove).not.to.equals(undefined);
    });
    it('query(等方法)方法都能正确的处理返回的正确结果，剥离固定结构\n', function () {
        $httpBackend.expectGET('/api/basic').respond(200, {
            code:0,
            data:{
                "count":1000,
                "total_pages":12,
                "current_page":1,
                "list":[
                    {}
                ]
            }
        });

        baseInst.query({}, function(data){
            expect(data.count).to.equal(1000);
            expect(data.total_pages).to.equal(12);
        });

        $httpBackend.flush();
    });
    it('get(等方法)方法都能正确的处理返回的错误结果（单条错误），剥离固定结构，调用错误处理代码\n', function () {
        $httpBackend.expectGET('/api/basic/12').respond(200, {
            code:1,
            msg: "some err message"
        });
        baseInst.get({id:12}, function(data){
            expect(false).to.equal(true);
        }, function(err){
            expect(err.code).to.equal(1);
            expect(err.msg).to.equal('some err message');
        });
        $httpBackend.flush();
    });
    it('创建实例的时候可以增加自定义方法，且可以正确的传入transformRespons等参数\n', function () {

        var richInst = BasicService("/api/basic/:id/:type/:itemId", {
            getInfoList: {
                method: 'GET',
                params: {
                    type: 'info'
                }
            }
        });
        expect(richInst.getInfoList).not.to.equals(undefined);

        $httpBackend.expectGET('/api/basic/12/info').respond(200, {
            code:0,
            data:{
                "count":1000,
                "total_pages":12,
                "current_page":1,
                "list":[
                    {}
                ]
            }
        });

        richInst.getInfoList({id:12}, function(data){
            expect(data.count).to.equal(1000);
            expect(data.total_pages).to.equal(12);
        });

        $httpBackend.flush();
    });

    it('子模型finance的get方法参数符合预期\n', function () {

        var Company = BasicService("/company/:id/:sub/:subid", {}, {"sub":["basic","finance"]});
        expect(Company.basic.query).not.to.equals(undefined);
        expect(Company.finance.query).not.to.equals(undefined);
    });

    it('子模型finance的get方法参数符合预期\n', function () {

        var Company = BasicService("/company/:id/:sub/:subid", {}, {"sub":["basic","finance"]});

        $httpBackend.expectGET('/company/12/finance/22').respond(200, {
            code:0,
            data:{
            }
        });

        Company.finance.get({id:12, subid:22});

        $httpBackend.flush();

    });

    it('子模型basic的get方法参数符合预期\n', function () {

        var Company = BasicService("/company/:id/:sub/:subid", {}, {"sub":["basic","finance"]});

        $httpBackend.expectGET('/company/12/basic').respond(200, {
            code:0,
            data:{
            }
        });

        Company.basic.get({id:12});

        $httpBackend.flush();

    });

});
