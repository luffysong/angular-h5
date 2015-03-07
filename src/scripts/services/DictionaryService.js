/**
 * Service Name: DictionaryService
 */

var angular = require('angular');

var app = angular.module('defaultApp.service').service('DictionaryService', [
    '$location', '$http',
    function ($location, $http) {
        var requested = false;
        var service = {
            name: "DictionaryService",
            _dict: DICTIONARY_DATA,
            getDict: function(name, callback){
                return service._dict[name];
            },
            getLocation: function(id){
              id = id || 0;

              return CITY_DATA.filter(function(v){
                return v.parentId == id;
              });

            },
            getHotLocation: function(){
              return CITY_DATA.filter(function(v){
                return v.parentId==0 || v.feature!=0;
              }).sort(function(a,b){
                  if(a.feature)return -1;
                  if(b.feature)return 1;
                  return a.id - b.id;
              });
            }
        }

        return service;
    }
]);

Object.keys(DICTIONARY_DATA).forEach(function(key){
    app.filter("dict_"+key, function(){
        return function(input){
            var out = input;
            DICTIONARY_DATA[key].forEach(function(item){
                if(item.value+"" === input+""){
                    out = item.desc;
                }else if(input == 'NONE'){
                    out = '未知'
                }
            });
            return out;
        }
    })
});

app.filter("city", function(){
  return function(input){
    var out = "";
    CITY_DATA.forEach(function(item){
      if(item.id==input){
        out = item.name;
      }
    });
    return out;
  }
});
