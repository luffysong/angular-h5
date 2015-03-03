describe('Main --> default application', function () {
  var $location, $state, $rootScope;

  beforeEach(module('defaultApp'));
  beforeEach(inject(function ($injector) {
    $location = $injector.get('$location');
    $state = $injector.get('$state');
    $rootScope = $injector.get('$rootScope');
  }));

  it('首页: /', function () {
    $location.path('/');
    $rootScope.$digest();
    expect($location.path()).to.equals('/');
    expect($state.$current.controller).to.equals('DefaultCtrl');
  });

  it('注册成功引导: /register/success', function () {
    $location.path('/register/success');
    $rootScope.$digest();
    expect($location.path()).to.equals('/register/success');
    expect($state.$current.controller).to.equals('RegisterSuccessController');
  });

  it('创建公司: /company/create', function () {
    $location.path('/company/create');
    $rootScope.$digest();
    expect($location.path()).to.equals('/company/create');
    expect($state.$current.controller).to.equals('CompanyCreateController');
  });

  it('公司Profile草稿: /company/:id/draft', function () {
    $location.path('/company/1/draft');
    $rootScope.$digest();
    expect($location.path()).to.equals('/company/1/draft');
    expect($state.$current.controller).to.equals('CompanyDraftController');
  });

  it('公司Profile总览: /company/:id', function () {
    $location.path('/company/1');
    $rootScope.$digest();
    expect($location.path()).to.equals('/company/1/draft');
    expect($state.$current.controller).to.equals('CompanyOverviewController');
  });

});
