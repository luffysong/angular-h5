/**
 * Service Name: AndroidUploadService
 */

var angular = require('angular');

androidUploadFileCallback = function(){

}

angular.module('defaultApp.service').service('AndroidUploadService',
    function () {

        var service = {
            setClick: function(callback){

                androidUploadFileCallback = callback;

                return function(e){
                    if(!window.kr36 || !window.kr36.chooseFile){
                        return function(){};
                    }

                    e.preventDefault();
                    setTimeout(function(){
                        window.kr36.chooseFile();
                    },100)
                }

            }
        };



        return service;
    }
);
