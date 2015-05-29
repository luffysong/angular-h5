/**
 * Controller Name: GuideWelcomeController
 */

var angular = require('angular');

angular.module('defaultApp.controller').controller('GuideWelcomeController',
    function($scope, UserService, $state, checkForm, ErrorService, $rootScope, $timeout) {
        $scope.user = {
            avatar:""
        };

        $scope.userId = UserService.getUID();
        $scope.changeAvatar = function(){
            AvatarEdit.open().result.then(function (data) {
                $scope.user.avatar = window.kr.upyun.bucket.url + data.url;
            }, function (err) {
                ErrorService.alert(err);
            });
        };

        UserService.basic.get({
            id: $scope.userId
        }, function(data){
            delete data.$promise;
            delete data.$resolved;
            //data.avatar = ""
            angular.extend($scope.user, angular.copy(data));
            if(data.phone){
                $scope.user.hasPhone = true;
                delete $scope.user.phone;
            }
            if(data.email && data.isEmailActivate){
                $scope.user.hasEmail = true;
                delete $scope.user.email;
            }
        });

        var checkTimeout;
        $scope.$watch('user.phone', function(phone){
            if(!phone || !$rootScope.REGEXP.phone.test(phone)){
                return;
            }
            $scope.guideForm.phone.$setValidity("checked", true);
            checkTimeout && $timeout.cancel(checkTimeout);
            checkTimeout = $timeout(function(){
                $scope.guideForm.phone.$setDirty();
                UserService.check.get({
                    id: $scope.userId,
                    phone: phone
                }, function(data){

                }, function(err){
                    $scope.guideForm.phone.$setValidity("checked", false);
                });
            },800);

        });

        $scope.$watch('user.email', function(email){
            if(!email || $scope.guideForm.email.$error.email){
                return;
            }
            $scope.guideForm.email.$setValidity("checked", true);
            checkTimeout && $timeout.cancel(checkTimeout);
            checkTimeout = $timeout(function(){
            $scope.guideForm.email.$setDirty();
                UserService.check.get({
                    id: $scope.userId,
                    email: email
                }, function(data){

                }, function(err){
                    $scope.guideForm.email.$setValidity("checked", false);
                });
            },800);
        });
        if(window.sessionStorage.applySpaceStatus) {
            $scope.applySpaceEnter = true;
        } else {
            $scope.applySpaceEnter = false;
        }

        $scope.submitForm = function(e){
            e && e.preventDefault();
            if(!checkForm('guideForm'))return;
            UserService.basic.update({
                id: $scope.userId
            }, {
                avatar: $scope.user.avatar,
                name: $scope.user.name,
                email: $scope.user.email,
                phone: $scope.user.phone,
                smscode: $scope.user.smscode
            }, function(data){
                if($scope.applySpaceEnter){
                    $state.go('krspace.judge');
                }else{
                    $state.go('guide.success-enter');
                }
                setTimeout(function(){
                    location.reload();
                },0);
            }, function(err){
                ErrorService.alert(err);
            })
        };



        $scope.getCode = function(e){
            e && e.preventDefault();
            if(!$scope.user.phone){
                return;
            }
            if($scope.wait){
                return;
            }
            $scope.wait = 60;
            var interval = setInterval(function(){
                $scope.$apply(function(){
                    $scope.wait--;
                    if($scope.wait==0){
                        clearInterval(interval);
                        $scope.wait = 0;
                    }
                })
            },1000);
            UserService['send-sms'].send({
                id: $scope.userId
            },{
                phone: $scope.user.phone
            }, function(data){
            }, function(err){
                ErrorService.alert({
                    msg:'发送失败!'
                });
            });
        }
    }
);
