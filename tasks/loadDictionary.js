var fs = require('fs');
var request = require('request');
var path = require('path');
var folderPath = path.resolve(__dirname, '../src/scripts/config');
var config = require('../config.json');
var baseUrl = 'http://rong.dev.36kr.com';
function loadCityData(callback){
    var cityFile = path.resolve(folderPath, 'city.js');
    request(baseUrl+'/api/dict/area', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            fs.writeFileSync(cityFile, 'window.CITY_DATA = '+JSON.stringify(JSON.parse(body).data.data))+";";
            callback && callback();
        }
    })
}

function loadDictData(callback){
    var cityFile = path.resolve(folderPath, 'dictionary.js');
    request(baseUrl+'/api/dict/common', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body);
            fs.writeFileSync(cityFile, 'window.DICTIONARY_DATA =  '+JSON.stringify(JSON.parse(body).data,null,4)+";");
            callback && callback();
        }
    })
}
function loadCFDictData(callback){
    var cityFile = path.resolve(folderPath, 'dictionary_cf.js');
    request(baseUrl+'/api/p/cf-dict', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body);
            fs.writeFileSync(cityFile, 'window.DICTIONARY_CF_DATA =  '+JSON.stringify(JSON.parse(body).data,null,4)+";");
            callback && callback();
        }
    })
}

module.exports = {
    loadCityData: loadCityData,
    loadDictData: loadDictData,
    loadCFDictData:loadCFDictData
};
