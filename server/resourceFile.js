var fs = require("fs"),
    layoutModLoad = require("./modLoad.js"),
    combine = require("./combine.js"),
    dirList = require("./dirList.js"),
    isUtf8 = require("is-utf8"),
    iconv = require("iconv-lite"),
    tempBufferConcat,
    finalMIME,
    MIME = {
        ".php": "text/html",
        ".ejs": "text/html",
        ".html": "text/html",
        ".css": "text/css",
        ".js": "application/x-javascript",
        ".txt": "text/plain",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".manifest": "text/cache-manifest",
        ".ico": "image/x-icon",
        ".gif": "image/gif",
        ".png": "image/png",
        ".json": "application/json",
        ".pdf": "application/pdf",
        ".swf": "application/x-shockwave-flash",
        ".tiff": "image/tiff",
        ".wav": "audio/x-wav",
        ".wma": "audio/x-ms-wma",
        ".wmv": "video/x-ms-wmv",
        ".xml": "text/xml"
    },
    config_map = JSON.parse(fs.readFileSync('./@Config.json', {encoding: 'utf-8'}));
function resourceFile(a, b, c, d) {
    var e = c.length;
    if (e > 1)for (var f = 0, g = 0, h = e, i = [], j = {}, k = function () {
        if (0 === h) {
            for (; e > g; g++)i.push(j["i" + g]);
            tempBufferConcat = Buffer.concat(i), finalMIME = MIME[d], b.writeHead(200, {"Content-Type": finalMIME}), b.write(tempBufferConcat), b.end()
        }
    }; e > f; f++)!function (a) {
        fs.readFile(c[a], function (b, c) {
            b || (j["i" + a] = c, h--, k());
        });
    }(f); else if (1 === e) {
        var l, m = c[0];
        if (fs.statSync(m).isDirectory())dirList.dirList(m, b); else if (m.indexOf("/wd/layout/") > -1)combine.combine(), l = ".php" === d || ".html" === d || '.ejs' === d ? (function () {
            var tl = layoutModLoad.layoutFileModLoad(m);
            try {
                var cdn = JSON.parse(fs.readFileSync('../.att', {'encoding': "utf8"}));
                var tt = tl.toString();
                for (var jk in config_map.replaceSrc) {
                    tt = tt.replace(jk, 'http://m.alicdn.com/' + cdn.cdnPath + config_map.replaceSrc[jk]);
                }
                tt = tt.replace('../publish/combineCss.css', 'http://m.alicdn.com/' + cdn.cdnPath + '/wd/publish/combineCss-' + config_map.timestamp + '.css').replace('../publish/combineJs.js', 'http://m.alicdn.com/' + cdn.cdnPath + '/wd/publish/combineJs-' + config_map.timestamp + '.js')
                if (!fs.existsSync('../wd/tmsPage')) fs.mkdirSync('../wd/tmsPage', '0777')
                fs.writeFile('../wd/tmsPage/' + config_map.dailyFileName + '-tms.html', tt.replace('<body>', '<?php echo "<bo"."dy>"; ?>').replace('</body>', '<?php echo "</bo"."dy>"; ?>'));
                for (var i in config_map.tmsReplace) {
                    if (fs.existsSync(config_map.tmsReplace[i])) {
                        tl = tl.replace(i, fs.readFileSync(config_map.tmsReplace[i], {encoding: 'utf-8'}));
                        tt = tt.replace(i, fs.readFileSync(config_map.tmsReplace[i], {encoding: 'utf-8'}));
                    }
                }
                tl = layoutModLoad.layoutFileModLoad(tl);
                tt = layoutModLoad.layoutFileModLoad(tt);
                fs.writeFile('../wd/tmsPage/' + config_map.dailyFileName + '.html', tt);
            } catch (e) {
                console.log(e)
            }
            return tl;
        })() : fs.readFileSync(m), b.writeHead(200, {"Content-Type": MIME[d]}), b.write(l), b.end(); else if (m.indexOf("/ajax/") > -1) {
            var n = {};
            "function" == typeof n[m] && n[m](a, b)
        } else fs.readFile(m, function (a, c) {
            a || (b.writeHead(200, {"Content-Type": MIME[d]}), b.write(c), b.end())
        })
    }
}
exports.resourceFile = resourceFile;