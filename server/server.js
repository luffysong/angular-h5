function onRequest(a, b) {
    router.router(a, b);
}
function serverStart() {
    http.createServer(onRequest).listen(port, ip), console.log(ip + ":" + port)
}
var http = require("http"), router = require("./router.js"), argvall = process.argv.slice(2), ip = "127.0.0.1", port = "80", ipcache;
if (argvall[0]) {
    var i = argvall[0].indexOf(".");
    -1 === i ? port = argvall[0] : i > -1 && (ip = argvall[0])
}
argvall[1] && (port = argvall[1]), serverStart();