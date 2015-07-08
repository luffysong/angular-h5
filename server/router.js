function router(a, b) {
    var c, d, e, f = url.parse(a.url), g = ".." + f.pathname, h = ".." + f.path, i = [];
    -1 === h.indexOf("??") ? (i.push(g), c = f.search, d = path.extname(g)) : (e = h.replace(reg_search, function (a, b, d) {
        return c = d, b
    }), d = path.extname(e), i = analyzeCombineUrl(e));
    for (var j = 0, k = i.length; k > j; j++)fs.existsSync(i[j]) || (i.splice(j, 1), k--);
    i.length > 0 ? resourceFile.resourceFile(a, b, i, d, c) : out404(b)
}
var url = require("url"), fs = require("fs"), path = require("path"), ejs = require("ejs"), resourceFile = require("./resourceFile"), reg_search = /([^\?]*\?\?[^\?]*)(\?($|[^\?]+))/gi, utf = require("is-utf8"), query = require("querystring"), json404, out404 = function (a) {
    json404 = {acc: "url有误"}, fs.readFile("./views/error404.ejs", {encoding: "utf-8"}, function (b, c) {
        a.writeHead(200, {"Content-Type": "text/html;charset=utf-8"}), a.end(ejs.render(c, json404))
    })
}, analyzeCombineUrl = function (a) {
    var b, c, d, e, f, g = a.indexOf("??"), h = a.lastIndexOf("?");
    for (b = a.slice(0, g), c = h - g > 1 ? a.slice(g + 2, h) : a.slice(g + 2, a.length), d = c.split(","), e = 0, f = d.length; f > e; e++)d[e] = b + d[e];
    return d
};
exports.router = router;