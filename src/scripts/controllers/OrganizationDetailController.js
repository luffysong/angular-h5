/**
 * Controller Name: OrganizationDetailController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('OrganizationDetailController', [
    '$scope', '$location',
    function($scope, $location) {
        //   	$scope.myInterval = 2000;
        // var slides = $scope.slides = [];
        // $scope.addSlide = function() {
        // 	var newWidth = 600 + slides.length + 1;
        // 	slides.push({
        // 	  image: 'http://placehold.it/580x340/09f/fff'
        // 	});
        // };
        // for (var i=0; i<4; i++) {
        // 	$scope.addSlide();
        // }

        $scope.myInterval = 2000;
        var slides = $scope.slides = [];
        $scope.addSlide = function() {
            var newWidth = 600 + slides.length + 1;
            slides.push({
                image: 'http://placekitten.com/' + newWidth + '/300',
                text: ['More', 'Extra', 'Lots of', 'Surplus'][slides.length % 4] + ' ' +
                    ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
            });
            console.log(slides);
        };
        for (var i = 0; i < 4; i++) {
            $scope.addSlide();
        }

        // var unbind = $swipe.bind()
    }
]);