/**
 * Service Name: DictionaryService
 */

var angular = require('angular');

var wholeDict = (function(){

    var dict = {};

    //处理融资字典
    angular.extend(dict, DICTIONARY_DATA);

    //处理众筹字典
    var cfDictNames = Object.keys(DICTIONARY_CF_DATA);
    cfDictNames.forEach(function(name){
        dict[name] = [];
        var vals = Object.keys(DICTIONARY_CF_DATA[name]);
        vals.forEach(function(val){
            var desc = DICTIONARY_CF_DATA[name][val];
            dict[name].push({
                value: val,
                desc: desc
            });
        })
    });

    dict.bank_limit_lianlianpay = DICTIONARY_CF_DATA.bank_limit_lianlianpay;
    dict.bank_order_lianlianpay = DICTIONARY_CF_DATA.bank_order_lianlianpay;

    // 公司网址黑名单
    angular.extend(dict, DICTIONARY_URL_DATA);

    return dict;
})();

var app = angular.module('defaultApp.service').service('DictionaryService', [
    '$location', '$http',
    function ($location, $http) {
        var requested = false;
        var service = {
            name: "DictionaryService",
            _dict: wholeDict,
            getDict: function(name, callback){
                return service._dict[name];
            },
            getLocation: function(id){
                id = id || 0;

                return CITY_DATA.filter(function(v){
                    return v.parentId == id;
                }).sort(function(a,b){
                    if(a.dispOrder && b.dispOrder) return b.dispOrder - a.dispOrder;
                    if(a.dispOrder)return -1;
                    if(b.dispOrder)return 1;
                    return a.name.localeCompare(b.name);
                });

            },
            getHotLocation: function(){
                return CITY_DATA.filter(function(v){
                    v.name = v.name.replace('特别行政区','');
                    return v.parentId==0 || v.feature!=0;
                }).sort(function(a,b){
                    if(a.dispOrder && b.dispOrder) return b.dispOrder - a.dispOrder;
                    if(a.dispOrder)return -1;
                    if(b.dispOrder)return 1;
                    return a.name.localeCompare(b.name);
                });
            }
        }

        return service;
    }
]);

Object.keys(wholeDict).forEach(function(key){
    app.filter("dict_"+key, function(){
        return function(input){
            var out = input;
            wholeDict[key].forEach(function(item){
                if(item.value+"" === input+""){
                    out = item.desc;
                }else if(item.id+"" === input+""){
                    out = item.desc;
                }else if(input == 'NONE'){
                    out = '未融资'
                }else if(input == 'UNKNOWN'){
                    out = '未知轮次'
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
