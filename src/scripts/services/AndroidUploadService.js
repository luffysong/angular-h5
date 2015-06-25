/**
 * Service Name: AndroidUploadService
 */

var angular = require('angular');

angular.module('defaultApp.service').service('AndroidUploadService',
    function () {

        var service = {
            setClick: function(callback){



                return function(e){
                    if(!window.kr36 || !window.kr36.chooseFile){
                        return function(){};
                    }

                    window.androidUploadFileCallback = callback;
                    e.preventDefault();
                    window.kr36.chooseFile();
                }

            }
        };



        return service;
    }
);
