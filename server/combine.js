function combine(a) {
    config_map = JSON.parse(fs.readFileSync('./@Config.json', {encoding: 'utf-8'}));
    version = a || "/** " + new Date + " @version " + config_map.timestamp + " **/\n", readOperate(originModPath), writeOperate({
        js: jsArr,
        css: cssArr
    }), cssArr = [], jsArr = []
}
function readOperate(a) {
    var b, c, d = fs.readdirSync(a);
    for (b = 0, c = d.length; c > b; b++)fs.statSync(a + "/" + d[b]).isFile() ? ".js" === path.extname(d[b]) ? "global.js" !== d[b] ? jsArr.push(fs.readFileSync(a + "/" + d[b], op)) : jsArr.unshift(fs.readFileSync(a + "/" + d[b], op)) : ".css" === path.extname(d[b]) && ("global.css" !== d[b] ? cssArr.push(fs.readFileSync(a + "/" + d[b], op)) : cssArr.unshift(fs.readFileSync(a + "/" + d[b], op))) : fs.statSync(a + "/" + d[b]).isDirectory() && readOperate(a + "/" + d[b])
}
function writeOperate(a) {

    fs.existsSync(publishPath) || fs.mkdirSync(publishPath, chmod),
        fs.writeFileSync(publishPath + jsName, version + a.js.join("")),
        fs.writeFileSync(publishPath + cssName, version + a.css.join("")),
        fs.readdir(publishPath, function (err, files) {
            files.forEach(function (el, i) {
                if (el.indexOf('combineCss-') > -1 || el.indexOf('combineJs-') > -1) {
                    fs.unlinkSync(publishPath + el);
                }
                fs.writeFileSync(publishPath + 'combineJs-' + config_map.timestamp + '.js', version + a.js.join(""))
                fs.writeFileSync(publishPath + 'combineCss-' + config_map.timestamp + '.css', version + a.css.join(""))
            })
        })

}
var fs = require("fs"), path = require("path"), argvall = process.argv, argv = argvall.slice(2), originModPath = "../wd/mods", publishPath = "../wd/publish/", chmod = "0777", jsName = "combineJs.js", cssName = "combineCss.css", cssArr = [], jsArr = [], version, op = {encoding: "utf-8"}, config_map;
exports.combine = combine;