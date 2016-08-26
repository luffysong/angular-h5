/**
 * Directive Name: rongCover
 */

/* globals Hammer*/

var angular = require('angular');

angular.module('defaultApp.directive').directive('rongCover', rongCover);
function rongCover() {
    return {
        restrict: 'A',
        link: function postLink(scope, element) {
            var hammertime = new Hammer(element[0]);
            hammertime.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL });
            hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
            hammertime.on('panstart', function panstart(ev) {
                ev.preventDefault();
            });

            function nextPage() {
                hammertime.destroy();
                element.css('transform', 'translateY(-100%)');
            }

            hammertime.on('panmove', function pan(ev) {
                ev.preventDefault();
                setNoneTransition(element);
                if (ev.center.y < 5) {
                    setTransition(element, window.innerHeight - ev.distance);
                    nextPage();
                }else if (ev.deltaY < 0) {
                    element.css('transform', 'translateY(' + ev.deltaY + 'px)');
                }
            });

            hammertime.on('panend', function panend(ev) {
                setTransition(element, window.innerHeight - ev.distance);
                if (ev.deltaY < -70) {
                    nextPage();
                }else {
                    element.css('transform', 'translateY(0%)');
                }
            });

            hammertime.on('swipe', function swipe(ev) {
                if (ev.deltaY < 0) {
                    var height = window.innerHeight;
                    var speed = ev.distance / ev.deltaTime;
                    var time = (height - ev.distance) / speed;
                    setTransition(element, time);
                    nextPage();
                }
            });
        },
    };
}

function setTransition(ele, time) {
    ele.css('transition', 'transform ' + time + 'ms ease-out');
}

function setNoneTransition(ele) {
    ele.css('transition', 'none');
}
