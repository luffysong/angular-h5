/**
 * Directive Name: submitBtn
 */

var angular = require('angular');

angular.module('defaultApp.directive')
    .config(function ($provide, $httpProvider) {
        $provide.factory('submitInterceptor', function ($q, $rootScope) {
            return {
                'request': function (config) {

                    $rootScope.$broadcast('submitRequestStart', config);
                    return config;
                },
                // optional method
                'response': function (response) {

                    $rootScope.$broadcast('submitRequestEnd', response);
                    return response;
                },
                // optional method
                'responseError': function(rejection) {
                    // do something on error
                    $rootScope.$broadcast('submitRequestEnd', rejection);
                    return $q.reject(rejection);
                }
            };
        });

        $httpProvider.interceptors.push('submitInterceptor');
    })
    .directive('submitBtn', function ($compile, checkForm, $rootScope) {
        return {
            restrict: 'AE',
            require: '?^form',
            link: function (scope, element, attrs, formCtrl) {
                var template = '<div class="btn-loading-wrap"><div class="spinner">\
                <div class="rect1"></div>\
                <div class="rect2"></div>\
                <div class="rect3"></div>\
                <div class="rect4"></div>\
                <div class="rect5"></div>\
                </div></div>';

                //if(formCtrl && formCtrl.$name){
                //    scope.$watch(formCtrl.$name+'.$invalid', function(v){
                //        attrs.$set('disabled', !!v);
                //    });
                //}



                $(element).click(function(e){
                    var startTimeout,endTimeout;
                    var bindStart, bindEnd;
                    var reqCount = 0;
                    var btn = $(this);
                    var cover;

                    var makeCover = function(btn){
                        var pos = btn.offset();
                        var w = btn.outerWidth();
                        var h = btn.outerHeight();
                        cover = $(template);
                        cover.appendTo('body').css({
                            width:w,
                            height:h,
                            top:pos.top,
                            left:pos.left
                        });
                    };
                    var delCover = function(){
                        cover.remove();
                    };
                    startTimeout = setTimeout(function(){
                        if(!reqCount){
                            bindStart();
                            bindEnd();
                        }
                    },300);
                    bindStart = scope.$on('submitRequestStart', function(ev, config){
                        if(!reqCount && !endTimeout){
                            makeCover(btn);
                            btn.css('visibility','hidden');
                        }
                        if(startTimeout){

                            clearTimeout(startTimeout);
                            startTimeout = null;
                        }
                        if(endTimeout){
                            console.log('Start After finish');
                            clearTimeout(endTimeout);
                            endTimeout = null;
                        }
                        reqCount ++;
                        console.log(reqCount, 'requests started!');
                    });
                    bindEnd = scope.$on('submitRequestEnd', function(ev, config){
                        reqCount --;
                        console.log(reqCount, 'requests left!');

                        if(reqCount)return;
                        delCover();
                        endTimeout = setTimeout(function(){
                            bindStart();
                            bindEnd();
                            delCover();
                            btn.css('visibility','visible');
                        },300);

                    });


                });

            }
        };
    });
/**
 * 应对如下几种情况：
 * 单个请求
 * 请求队列
 * 并发请求
 * 以及上边集中请求的集合
 */
