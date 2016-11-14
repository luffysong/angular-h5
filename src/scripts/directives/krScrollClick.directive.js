/**
 * Directive Name: krScrollClick
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('krScrollClick',
    function ($rootScope, $timeout) {
        $rootScope.$on('duScrollspy:becameActive', function becameActive($event, $element) {
            var root = $rootScope.root;
            var hash = $element.prop('hash');
            if (hash) {
                root.hash = hash.replace('#', '');
            }

            if (root.activeClickEle && root.clickHash !== root.hash) {
                root.activeClickEle.removeClass('active');
            }
        });

        return {
            restrict: 'AE',
            link: function ($scope, ele, attr) {
                $(ele).click(function () {
                    $timeout(function () {
                        $('.active').removeClass('active');
                        if (!ele.hasClass('active')) {
                            ele.addClass('active');
                        }

                        $rootScope.root.hash = attr.href.replace('#', '');
                        $rootScope.root.clickHash = $scope.root.hash;
                        $rootScope.root.activeClickEle = ele;
                    }, 400);
                });
            }
        };
    }
);
