var path = require('path');
var fs = require('fs');

function buildNavJs(){
    var folderPath = path.resolve(__dirname, '../src/navigation');
    var targetPath = path.resolve(folderPath, 'dist');
    var targetFile = path.resolve(targetPath, 'navigation.js');
    var htmlPath = path.resolve(folderPath, 'navigation.html');
    var cssPath = path.resolve(folderPath, 'navigation.css');
    var templatePath = path.resolve(folderPath, 'template.js');

    var html = fs.readFileSync(htmlPath).toString();
    var css = fs.readFileSync(cssPath).toString();
    var template = fs.readFileSync(templatePath).toString();

//处理html,把内容拿出来
    var navHtml = html.replace(/\n|\r|(\s+?(?=<))/g, '').match(/<body>(.+?)<\/body>/)[1];
    var htmlStr = JSON.stringify(navHtml);
    css = JSON.stringify(['<style>',css,'</style>'].join(""));
    var distContent = template.replace('{{html}}', htmlStr).replace('{{css}}',css);
    fs.writeFileSync(targetFile, distContent);
}

module.exports = buildNavJs;



