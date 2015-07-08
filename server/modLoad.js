var fs = require("fs"),
    reg = /<%\s{0,}mod_load\(([^)]*)\)\s{0,}%>/gi,
    isUtf8 = require("is-utf8"),
    iconv = require("iconv-lite"),
    modPathReg = /\w[^'"]{1,}/gi;
function layoutFileModLoad(a) {
    var b, c;
    if (a.match(/^\.\.\/wd/)) {
        try {
            c = fs.readFileSync(a);
        } catch (e) {
            return '----------------------引用错误: ' + a;
        }
    } else {
        c = new Buffer(a);
    }

    return isUtf8(c) ? c = iconv.decode(c, "utf-8") : (b = iconv.decode(c, "gbk"), b = iconv.encode(b, "utf-8"), c = iconv.decode(b, "utf-8")), c.replace(reg, function (a, b) {
        return layoutFileModLoad(analysePath(b))
    })
}
function analysePath(a) {
    var b = a.split(",");
    return "../wd/mods/" + b[1].match(modPathReg)[0] + "/" + b[2].match(modPathReg)[0]
}

exports.layoutFileModLoad = layoutFileModLoad;