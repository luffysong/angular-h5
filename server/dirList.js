function dirList(a, b) {
    pathname = -1 === a.indexOf("../") ? a : a.slice(2), dirpath = a.lastIndexOf("/") === a.length - 1 ? pathname : pathname + "/", htmlStr = fs.readFileSync("./views/dirList.ejs", {encoding: "utf-8"}), fs.readdir(a, function (c, d) {
        d.length > 0 ? (listData.items = [], d.forEach(function (b) {
            liname = b, litype = fs.statSync(a + splitFlag + b).isFile() ? "0" : "1", listData.items.push({
                liname: liname,
                litype: litype
            })
        })) : listData.items = !1, listData.dirpath = dirpath, listData.parentPathLink = path.dirname(pathname), b.writeHead(200, {"Content-Type": "text/html;charset=utf-8"}), b.end(ejs.render(htmlStr, listData))
    })
}
var fs = require("fs"), ejs = require("ejs"), path = require("path"), splitFlag = "Windows_NT" === process.env.OS ? "\\" : "/", htmlStr, listData = {
    items: [],
    dirName: "",
    parentPathLink: ""
}, pathname, liname, litype;
exports.dirList = dirList;