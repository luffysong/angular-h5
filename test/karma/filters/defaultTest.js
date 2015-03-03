describe('Filter --> default filter', function () {
  var $filter;

  beforeEach(module('defaultApp.filter'));
  beforeEach(inject(function ($injector) {
    $filter = $injector.get('$filter');
  }));

  it('测试默认 filter', function () {
    expect($filter('default')('')).to.equals('demo');
  });
});