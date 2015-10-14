/**
 * Directive Name: Loading Bar
 */

var angular = require('angular');

angular.module('defaultApp.directive').directive('loadingProgress', [
    '$location','$timeout',
    function($location,$timeout) {
        return {
            restrict: 'AE',
            scope: {
                percent: "=percent",
                loadingTip: "=loadingTip",
                sucData:"=sucRaise",
                goalData:"=raiseGoal",
                fund:"@fund"
            },
            template: '<div class="loading-progress"><div class="loading-bar" ng-class="{max:percent >= 100}">{{percent}}%</div></div>',
            link: function(scope, element, attrs) {
                function drawLine(id,color){
                    if(!document.getElementById(id))return;
                    var cxt = document.getElementById(id).getContext("2d");
                    if(id.indexOf("canvas_has") >= 0){
                        cxt.moveTo(0,15);
                        cxt.lineTo(10,0);
                        cxt.lineTo(15,0);
                    }else if(id.indexOf("canvas_goal") >= 0){
                        cxt.moveTo(15,0);
                        cxt.lineTo(5,15);
                        cxt.lineTo(0,15);
                    }else{

                    }
                    cxt.strokeStyle = color;
                    cxt.stroke();
                }
                function handleData(num){
                    if(!num || num == 0){
                        return "即将开启";
                    }else{
                        if(parseInt(num) >= 10000){
                            i = parseInt(num) / 10000 + "万";
                        }else{
                            i = parseInt(num);
                        }
                        return "￥" + i;
                    }
                }
                /*生成随机id*/
                var randomId = parseInt(Math.random()*10000);
                /*已筹集*/
                var canvas_has = $("<canvas width='15' height='15' id='canvas_has"+ randomId +"' class='myCanvas'>");
                /*众筹目标*/
                var canvas_goal = $("<canvas width='15' height='15' id='canvas_goal"+ randomId +"' class='myCanvas'>");
                scope.$watch('percent', function(percent){
                    if(percent || percent === 0) {
                        var per = percent;
                        per = Math.min(per, 100);
                        if(element.find(".loading-bar")) {
                            if(scope.loadingTip) {
                                var data = "";
                                var temp = "";
                                var max = per == 100 ? true : false;
                                /*已筹集线条*/
                                var container = $("<div class='loading-container'></div>");
                                data = handleData(scope.sucData);
                                temp = handleData(scope.goalData);
                                var str = scope.fund ? "领投" : "已筹集";
                                if(max){
                                    var color = "#fe7a65";
                                    container.append(canvas_has).append("<span class='loading-point max'></span><span class='loading-detail'>"+ str +"：" + data + "</span>");
                                }else{
                                    var color = "#73c8ff";
                                    container.append(canvas_has).append("<span class='loading-point'></span><span class='loading-detail'>" + str + "：" + data + "</span>");
                                }
                                element.find(".loading-progress").append(container);
                                drawLine("canvas_has"+randomId,color);
                                /*众筹目标线条*/
                                var container_progress = $("<div class='loading-container syndicate-goal'></div>");
                                container_progress.append("<span class='loading-detail'>众筹目标：" + temp + "</span><span class='loading-point'></span>").append(canvas_goal);
                                element.find(".loading-progress").append(container_progress);
                                drawLine("canvas_goal"+randomId,"#dddddd");
                            }
                            element.find(".loading-bar").each(function() {
                                $(this).css("width", per + "%");
                                if(scope.fund){
                                    $(this).empty();
                                }
                            });
                        } else {
                        }
                    } else if (percent + "" === "0") {
                        element.find(".loading-bar").hide();
                    }
                });
            }
        };
    }
]);
