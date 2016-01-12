var angular = require('angular');

angular.module('defaultApp.service').directive('imgCropped', function($timeout) {
    var bounds = { x: 0, y: 0 };

    return {
        restrict: 'A',
        scope: { src: '=', rotate: '=', selected: '&' },
        link: function(scope, element) {
            var myImg;
            var _myImg;
            var clear = function() {
                if (myImg) {
                    myImg.next().remove();
                    myImg.remove();
                    myImg = undefined;
                }
            };

            scope.$watch('rotate', function() {
                if (!myImg) {
                    return false;
                }

                //element.find('img').css({
                //    '-webkit-transform': 'rotate(' + scope.rotate + 'deg)',
                //    '-moz-transform': 'rotate(' + scope.rotate + 'deg)',
                //    '-ms-transform': 'rotate(' + scope.rotate + 'deg)',
                //    '-o-transform': 'rotate(' + scope.rotate + 'deg)',
                //    'transform': 'rotate(' + scope.rotate + 'deg)'
                //});
            });

            scope.$watch('src', function(nv) {
                clear();
                if (!nv) {
                    return;
                }

                myImg = angular.element('<img style="width:100%;"/>');
                myImg.attr('src', nv);
                _myImg = angular.element('<img style="position: absolute;z-index:-1;opacity:0;"/>');
                _myImg.attr('src', nv);
                element.append(myImg);
                element.append(_myImg);
                $timeout(function() {
                    var cW = $(myImg).width();
                    var cH = $(myImg).height();
                    var cSize = cW > cH ? cH : cW;
                    var cTop = 0;
                    var cLeft = 0;
                    if (cSize === cH) {
                        cLeft = (cW - cH) / 2;
                    }else {
                        cTop = (cH - cW) / 2;
                    }

                    $(myImg).Jcrop({
                        trackDocument: true,
                        setSelect: [cLeft, cTop, cSize, cSize],
                        onSelect: function(cords) {
                            $timeout(function() {
                                scope.$apply(function() {
                                    cords.bx = bounds.x;
                                    cords.by = bounds.y;
                                    scope.selected({
                                        cords: cords,
                                        _pic: {
                                            w: _myImg.width(),
                                            h: _myImg.height()
                                        }
                                    });
                                });
                            });
                        },

                        aspectRatio: 1
                    }, function() {
                        var boundsArr = this.getBounds();
                        bounds.x = boundsArr[0];
                        bounds.y = boundsArr[1];
                    });
                }, 100);

            });

            scope.$on('$destroy', clear);

        }
    };
});

angular.module('defaultApp.service').factory('fileReader', function($q) {
    var onLoad = function(reader, deferred, Sscope) {
        return function() {
            Sscope.$apply(function() {
                deferred.resolve(reader.result);
            });
        };
    };

    var onError = function(reader, deferred, Sscope) {
        return function() {
            Sscope.$apply(function() {
                deferred.reject(reader.result);
            });
        };
    };

    var onProgress = function(reader, Sscope) {
        return function(event) {
            Sscope.$broadcast('fileProgress', { total: event.total, loaded: event.loaded });
        };
    };

    var getReader = function(deferred, Sscope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, Sscope);
        reader.onerror = onError(reader, deferred, Sscope);
        reader.onprogress = onProgress(reader, Sscope);
        return reader;
    };

    var readAsDataURL = function(file, Sscope) {
        var deferred = $q.defer();
        var reader = getReader(deferred, Sscope);
        reader.readAsDataURL(file);
        return deferred.promise;
    };

    return { readAsDataUrl: readAsDataURL };
});

angular.module('defaultApp.service').directive('krFileSelect', function() {
    return {
        scope: {
            krChange: '&krChange', krModel: '=krModel'
        }, link: function(dirScope, el) {
            el.bind('change', function(e) {
                dirScope.krModel.file = (e.srcElement || e.target).files[0];
                dirScope.krChange();
            });
        }
    };
});

angular.module('defaultApp.service').factory('AvatarEdit', function($modal, ErrorService) {
    return {
        open: function() {
            return $modal.open({
                templateUrl: 'templates/avatar-edit.html',
                backdrop: 'static',
                controller: function($scope, $timeout, $upload, $modalInstance, fileReader, DefaultService) {
                    $scope.file = {};
                    $scope.corpWrapStyle = {};
                    $scope.cropScale = 1;
                    var wrapSize = [400, 400];
                    $scope.getFile = function() {
                        $scope.$apply(function() {
                            $scope.readingFile = true;
                        });

                        fileReader.readAsDataUrl($scope.file.file, $scope).then(function(result) {

                            var img = new Image();
                            img.onload = function() {
                                $scope.readingFile = false;
                                var width = img.width;
                                var height = img.height;
                                var ratio = width / height;
                                var wrapRatio = wrapSize[0] / wrapSize[1];
                                var finalSize = [];
                                $scope.$apply(function() {
                                    if (ratio > wrapRatio) {
                                        finalSize[0] = wrapSize[0];
                                        finalSize[1] = finalSize[0] / ratio;
                                    } else {
                                        finalSize[1] = wrapSize[1];
                                        finalSize[0] = finalSize[1] * ratio;
                                    }

                                    $scope.cropScale = finalSize[0] / width;
                                    $scope.corpWrapStyle = {
                                        width: finalSize[0],
                                        height: finalSize[1],
                                        left: (wrapSize[0] - finalSize[0]) / 2,
                                        top: (wrapSize[1] - finalSize[1]) / 2
                                    };
                                    $scope.imageSrc = result;
                                });
                            };

                            img.onerror = function() {
                                ErrorService.alert({
                                    msg:'图片格式有误，请重新选择文件'
                                });
                                $scope.$apply(function() {
                                    $scope.readingFile = false;
                                });
                            };

                            img.src = result;

                        });
                    };

                    $scope.previewRotate = 0;
                    $scope.selected = function(cords, _pic) {

                        $scope.picWidth = _pic.w * $scope.cropScale;
                        $scope.picHeight = _pic.h * $scope.cropScale;

                        $scope._picWidth = _pic.w;
                        $scope._picHeight = _pic.h;

                        $scope.cropped = true;

                        $scope.previewStyle = {
                            width: $scope.picWidth * 100 / cords.w,
                            height: $scope.picHeight * 100 / cords.h,
                            marginLeft: -(cords.x * 100 / cords.w),
                            marginTop: -(cords.y * 100 / cords.h),
                            transform: 'rotate(' + $scope.previewRotate + 'deg)',
                            transformOrigin: [(cords.x * 100 / cords.w) + 50 + 'px', (cords.y * 100 / cords.h) + 50 + 'px'].join(' ')
                        };
                    };

                    $scope.rotateLeft = function() {
                        $scope.previewRotate -= 90;
                        $scope.previewStyle.transform = 'rotate(' + $scope.previewRotate + 'deg)';
                    };

                    $scope.rotateRight = function() {
                        $scope.previewRotate += 90;
                        $scope.previewStyle.transform = 'rotate(' + $scope.previewRotate + 'deg)';
                    };

                    $scope._demoFiles = [];

                    // 确认
                    $scope.ok = function() {

                        var crop = {
                            x: -($scope.previewStyle.marginLeft * $scope._picWidth / $scope.previewStyle.width),
                            y: -($scope.previewStyle.marginTop * $scope._picHeight / $scope.previewStyle.height),
                            width: 100 * $scope._picWidth / $scope.previewStyle.width,
                            height: 100 * $scope._picHeight / $scope.previewStyle.height
                        };

                        var rotate = $scope.previewRotate % 360;
                        if (rotate < 0) {
                            rotate = 360 + rotate;
                        } else if (rotate === 0) {
                            rotate = 'auto';
                        }

                        var x;
                        var y;

                        switch (rotate){
                            case 90:
                                x = $scope._picHeight - crop.y - crop.height;
                                y = crop.x;
                                crop.x = x;
                                crop.y = y;
                                break;
                            case 180:
                                y = $scope._picHeight - crop.y - crop.height;
                                x = $scope._picWidth - crop.x - crop.width;
                                crop.x = x;
                                crop.y = y;
                                break;
                            case 270:
                                x = crop.y;
                                y = $scope._picWidth - crop.x - crop.width;
                                crop.x = x;
                                crop.y = y;
                                break;
                            default :
                                break;
                        }

                        var parameter = {
                            'x-gmkerl-crop': parseInt(crop.x, 10) + ',' + parseInt(crop.y, 10) + ',' + parseInt(crop.width, 10) + ',' + parseInt(crop.height, 10),
                            'x-gmkerl-rotate': rotate
                        };

                        var upyun = window.kr.upyun;

                        DefaultService.getUpToken(parameter).then(function(data) {
                            $scope.upload = $upload.upload({
                                url: upyun.api + '/' + upyun.bucket.name,
                                data: data,
                                file: $scope.file.file,
                                withCredentials: false
                            }).progress(function(evt) {
                                $scope.progress = parseInt(100.0 * evt.loaded / evt.total);

                                //console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :' + evt.config.file.name);
                            }).success(function(data) {
                                $scope.progress = 0;
                                $modalInstance.close(data);
                            }).error(function() {
                                ErrorService.alert({
                                    msg: '格式不支持，请重新选择文件！'
                                });
                                $scope.progress = 0;
                            });
                        }, function(err) {

                            ErrorService.alert(err);
                        });
                    };

                    $scope.cancel = function() {
                        $modalInstance.close();
                    };
                }
            });
        }
    };
});
