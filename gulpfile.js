/*globals -$ */

//jscs:disable requireCamelCaseOrUpperCaseIdentifiers
var path = require('path');
var fs = require('fs');

//not use
//var crypto = require('crypto');
var _ = require('lodash');
var gulp = require('gulp');
var karma = require('karma');
var $ = require('gulp-load-plugins')();
var es = require('event-stream');
var loadDictionary = require('./tasks/loadDictionary.js');
var urlAdjuster = require('gulp-css-url-adjuster');

var config = require('./config.json');

var through2 = require('through2');
var browserify = require('browserify');
var apiHost;

var reloadTimeout;
var CDNPrefix;
var buildMode = 'prod';

function reloadPage() {
    return es.map(function(file, callback) {
        if (reloadTimeout) {
            clearTimeout(reloadTimeout);
            reloadTimeout = null;
        }

        reloadTimeout = setTimeout(function() {
            setTimeout(function() {
                gulp.src(['src/index.html']).pipe($.connect.reload());
                reloadTimeout = null;
            }, 1000);
        }, 1000);

        return callback(null, file);
    });
}

// 错误处理
var handler = function(err) {
    $.util.beep();
    $.util.log($.util.colors.red(err.name), err.message);
};

// 清除垃圾数据
gulp.task('clean', function(callback) {
    var del = require('del');
    del(['.tmp', 'dist'], callback);
});

gulp.task('html', ['header'], function() {
    gulp.src(['src/*.html', 'src/templates/**/*.html'])

        //.pipe(gulp.dest('.tmp'))
        .pipe(reloadPage());
});

// 样式
gulp.task('styles', function() {
    gulp.src(['src/styles/*.less'])
        .pipe($.plumber({
            errorHandler: handler,
        }))
        .pipe($.less({
            dumpLineNumbers: 'comments',
        }))
        .pipe($.plumber.stop())
        .pipe($.autoprefixer('last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('.tmp/styles'))
        .pipe(reloadPage())
        .pipe($.size());
});

// Scripts Init
var scriptsInit = function(modulesPath) {
    var scriptText = '';
    fs.readdirSync(modulesPath).forEach(function(file) {
        if (file !== 'index.js' && /\.js$/.test(file)) {
            scriptText += 'require(\'./' + file.replace('.js', '') + '\');\n';
        }
    });

    var src = require('stream').Readable({
        objectMode: true,
    });

    src._read = function() {
        this.push(new $.util.File({
            cwd: '',
            base: '',
            path: 'index.js',
            contents: new Buffer(scriptText),
        }));
        return this.push(null);
    };

    return src.pipe(gulp.dest(modulesPath));
};

gulp.task('scripts:init:controllers', function() {
    return scriptsInit('src/scripts/controllers');
});

gulp.task('scripts:init:directives', function() {
    return scriptsInit('src/scripts/directives');
});

gulp.task('scripts:init:filters', function() {
    return scriptsInit('src/scripts/filters');
});

gulp.task('scripts:init:services', function() {
    return scriptsInit('src/scripts/services');
});

gulp.task('scripts:init', ['scripts:init:controllers', 'scripts:init:directives', 'scripts:init:filters', 'scripts:init:services']);

// Scripts Ui Bootstrap Template
gulp.task('scripts:ui:template', function() {
    return gulp.src(config.angularUiTpls)
        .pipe($.html2js({
            outputModuleName: 'ui.bootstrap.tpls',
            base: 'src/components/angular-ui-bootstrap/',
        }))
        .pipe($.concat('template.js'))
        .pipe(gulp.dest('.tmp/scripts/'))
        .pipe($.size());
});

// Scripts Vendor
gulp.task('scripts:vendor', function() {
    var files = config.vendors;
    files.push('src/scripts/config/env_' + buildMode + '.js');
    return gulp.src(files)
        .pipe($.sourcemaps.init())
        .pipe($.concat('vendor.js'))

        //.pipe($.ngmin())
        //.pipe($.uglify())
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('.tmp/scripts'))
        .pipe($.size());
});

// Scripts Browserify
gulp.task('scripts:browserify', ['scripts:init'], function() {
    gulp.src(['src/scripts/*.js'])
        .pipe($.plumber({ errorHandler: handler }))

        // .pipe($.browserify({debug: true}))
         .pipe(through2.obj(function(file, enc, next) {
             var self = this;
             browserify(file.path, {
                 debug:true,
             })

             // .transform(reactify)
                 .bundle(function(err, res) {
                     if (err) {
                         console.log(err.stack);
                     }

                     file.contents = new Buffer(res);
                     self.push(file);
                     next();
                 });
         }))
        .pipe($.plumber.stop())

        //.pipe($.ngmin())
        //.pipe($.uglify())
        //.pipe($.sourcemaps.write())
        .pipe(gulp.dest('.tmp/scripts'))
        .pipe($.size())
        .pipe(reloadPage());
});

// Scripts
gulp.task('scripts', ['scripts:vendor', 'scripts:browserify', 'scripts:ui:template']);

gulp.task('karma', ['scripts:vendor', 'scripts:init'], function() {
    karma.server.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true,
    }, function() {
        process.exit();
    });
});

//TDD模式：自动watch代码变化，运行测试用例
gulp.task('tdd', ['scripts:vendor', 'scripts:init', 'watch'], function() {
    gulp.watch(['src/scripts/**/*.js'], ['scripts:vendor', 'scripts:init']);
    gulp.watch(['karma_html/**/*.html'], function() {
        gulp.src(['karma_html/**/*.html']).pipe(reloadPage());
    });

    karma.server.start({
        configFile: __dirname + '/karma.conf.js',
    }, function() {
        process.exit();
    });

    var historyApiFallback = require('connect-history-api-fallback');
    $.connect.server({
        root: ['karma_html', '.tmp', 'src'],
        port: 9001,
        livereload: false,
        middleware: function() {
            return [historyApiFallback];
        },
    });
});

gulp.task('test', function() {
    gulp.start('karma');
});

// http 服务
// gulp.task('connect', function() {
//     var historyApiFallback = require('connect-history-api-fallback');
//     $.connect.server({
//         root: ['.tmp', 'src'],
//         port: 9001,
//         livereload: false,
//         middleware: function(connect, opt) {
//             var url = require('url');
//
//             var map = [];
//
//             map.push(require('connect-query')());
//             map.push(require('connect-multiparty')());
//
//             var bodyParser = require('body-parser');
//             map.push(bodyParser.urlencoded({ extended: false }));
//             map.push(bodyParser.json());
//
//             map.push(function(req, res, done) {
//                 if (req.originalUrl !== '/api/upload/form-api') {
//                     return done();
//                 }
//
//                 var secret = req.body.type == 'pic' ? config.upyun.bucket.secret : config.upyun.fileBucket.secret;
//                 var policy = new Buffer(req.body.param).toString('base64');
//                 var signature = crypto.createHash('md5').update(policy + '&' + secret).digest('hex');
//                 res.writeHead(200, { 'Content-Type': 'application/json' });
//                 res.statuCode = 200;
//                 res.end(JSON.stringify({
//                     code: 0,
//                     data: {
//                         policy: policy,
//                         signature: signature,
//                     },
//                 }));
//             });
//
//             map.push(function(req, res, done) {
//                 if (req.originalUrl.indexOf('/user/login') == -1) {
//                     return done();
//                 }
//
//                 res.writeHead(302, {
//                     Location: req.originalUrl.replace('/user/login', '/oauth/callback'),
//                 });
//                 res.end();
//             });
//
//             map.push(function(req, res, done) {
//                 if (req.originalUrl.indexOf('/oauth/callback') == -1) {
//                     return done();
//                 }
//
//                 res.writeHead(302, {
//                     Location: decodeURIComponent(req.originalUrl.replace('/oauth/callback?from=', '')),
//                     'Set-Cookie': 'kr_plus_id=1;Path=/;Expires=Wed, 09 Jun 2021 10:18:14 GMT;Domain=.36kr.com;',
//                     'Set-Cookie': 'kr_valid=1;Path=/;Expires=Wed, 09 Jun 2021 10:18:14 GMT;Domain=.36kr.com;',
//                     'Set-Cookie': 'kr_email_valid=1;Path=/;Expires=Wed, 09 Jun 2021 10:18:14 GMT;Domain=.36kr.com;',
//                 });
//                 res.end();
//             });
//
//             map.push(function(req, res, done) {
//                 if (req.originalUrl.indexOf('/api/') !== 0) {
//                     return done();
//                 }
//
//                 var url = req._parsedUrl.pathname.substring(5);
//                 var filePath = 'mocksup-data/' + url + '.' + req.method;
//                 var indexFilePath = 'mocksup-data/' + url + '/index.' + req.method;
//
//                 filePath = filePath.replace(/[0-9]+/g, ':integer').replace(/(\/\/){1}/g, '/');
//                 indexFilePath = indexFilePath.replace(/[0-9]+/g, ':integer').replace(/(\/\/){1}/g, '/');
//
//                 fs.exists(filePath, function(exist) {
//                     if (!exist) {
//                         fs.exists(indexFilePath, function(exist) {
//                             if (!exist) {
//                                 return done();
//                             }
//
//                             fs.readFile(indexFilePath, function(err, data) {
//                                 if (err) {
//                                     return done(err);
//                                 }
//
//                                 try {
//                                     res.writeHead(200, { 'Content-Type': 'application/json' });
//                                     res.statuCode = 200;
//                                     res.end(_.template(data, {
//                                         headers: req.headers,
//                                         query: req.query,
//                                         body: req.body,
//                                     }));
//                                 } catch (err) {
//                                     return done(err);
//                                 }
//                             });
//                         });
//                     } else {
//                         fs.readFile(filePath, function(err, data) {
//                             if (err) {
//                                 return done(err);
//                             }
//
//                             try {
//                                 res.writeHead(200, { 'Content-Type': 'application/json' });
//                                 res.statuCode = 200;
//                                 res.end(_.template(data, {
//                                     headers: req.headers,
//                                     query: req.query,
//                                     body: req.body,
//                                 }));
//                             } catch (err) {
//                                 return done(err);
//                             }
//                         });
//                     }
//                 });
//             });
//
//             //map.push(historyApiFallback);
//             return map;
//         },
//     });
// });

// http 服务
gulp.task('connect:remote', function() {
    // not use
    // var historyApiFallback = require('connect-history-api-fallback');
    $.connect.server({
        root: ['.tmp', 'src'],
        port: 9001,
        livereload: false,
        middleware: function() {
            var url = require('url');
            var proxy = require('./tasks/proxy.js');

            var _proxy = function(path, source) {
                var options = url.parse(source);
                options.route = path;
                return proxy(options);
            };

            var map = [];

            map = map.concat(_.map(config.proxys, function(proxy) {
                var source = proxy.source;
                if (apiHost) {
                    source = source.replace('http://rong.dev.36kr.com', apiHost);
                }

                return _proxy(proxy.path, source);
            }));

            //map.push(historyApiFallback);
            return map;
        },
    });
});

// Watch
gulp.task('watch', function() {
    gulp.watch('src/**/*.html', ['header']);
    gulp.watch('src/styles/**/*.less', ['styles']);
    gulp.watch(['src/scripts/**/*.js'], ['scripts:browserify']);
    gulp.watch(['src/navigation/*.js', 'src/navigation/*.html', 'src/navigation/*.css'], ['header']);
});

// Build Assets
gulp.task('build:assets', function() {
    return gulp.src(['src/*.{ico,png,txt,xml}', 'src/*/dist/navigation.js'])
        .pipe($['if']('*.js', $.uglify()))
        .pipe(gulp.dest('dist'))
        .pipe($.size());
});

// Build Fonts
gulp.task('build:fonts', function() {
    return gulp.src(['src/**/*.{eot,svg,ttf,woff,woff2}'])
        .pipe($.flatten())
        .pipe(gulp.dest('.tmp/fonts'))
        .pipe($.size());
});

// Build Styles
gulp.task('build:styles', function() {
    return gulp.src(['src/styles/*.less'])
        .pipe($.less())
        .pipe($.autoprefixer('last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(urlAdjuster({
            replace:  [/(\.\..*?|^)(?=fonts|images)/, '../'],
        }))
        .pipe(gulp.dest('.tmp/styles'))
        .pipe($.size());
});

// Build Angular Templates
gulp.task('build:templates', function() {
    return gulp.src(['src/templates/**/*.html'])
        .pipe($.replace('styles/images/', 'images/'))
        .pipe($.angularTemplatecache({
            root: 'templates/',
        }))
        .pipe(gulp.dest('src/scripts'))
        .pipe($.size());
});

gulp.task('build:addTemplates', function() {
    return gulp.src(['src/scripts/**/*.js'])
        .pipe($.replace(/\/\*##(.+)##\*\//, '$1'))
        .pipe(gulp.dest('.tmp/tmp-scripts'));
});

// Build Scripts
gulp.task('build:scripts', ['scripts:vendor', 'scripts:ui:template', 'scripts:init', 'build:templates', 'build:addTemplates'], function() {
    return gulp.src(['.tmp/tmp-scripts/*.js'])
		.pipe(through2.obj(function(file, enc, next) {
    var self = this;
    browserify(file.path)
			.bundle(function(err, res) {
    if (err) {
        console.log(err.stack);
    }

    file.contents = new Buffer(res);
    self.push(file);
    next();
			});
		}))

        // .pipe($.browserify())
        .pipe($.ngAnnotate())  //处理angular依赖
        .pipe(gulp.dest('.tmp/scripts'))
        .pipe($.size());
});

// Build Images
gulp.task('build:images', function() {
    return gulp.src(['src/styles/images/**/*'])
        .pipe($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true,
        }))
        .pipe(gulp.dest('.tmp/images'))
        .pipe($.size());
});

// Build Html
gulp.task('build:html', ['build:assets', 'build:fonts', 'build:styles', 'build:scripts', 'build:images'], function() {
    var assets = $.useref.assets({
        searchPath: ['.tmp', 'src'],
    });

    return gulp.src(['.tmp/*.html'])
        .pipe($.replace('styles/images/', 'images/'))
        .pipe(assets)
        .pipe($['if']('*.css', $.cssnano({ debug:true })))
        .pipe($['if']('*.js',
            $.uglify({ compress:{
				drop_console:true }
            })))
        .pipe(assets.restore())
        .pipe($.useref())

        .pipe($['if']('*.css', gulp.dest('.tmp/build')))
        .pipe($['if']('*.js', gulp.dest('.tmp/build')))
        .pipe($['if']('*.html', gulp.dest('dist')))
        .pipe($.size());
});

// Build Rev
gulp.task('build:rev', ['build:html'], function() {
    return gulp.src(['.tmp/{fonts,images}/**', '.tmp/build/{styles,scripts}/**'])
        .pipe($.revAll({
            transformFilename: function(file, hash) {
                var ext = path.extname(file.path);
                return hash.substr(0, 8) + '.' + path.basename(file.path, ext) + ext;
            },
        }))
        .pipe(gulp.dest('dist'))
        .pipe($.revAll.manifest({ fileName: 'manifest.json' }))
        .pipe(gulp.dest('.tmp'));
});

// Build Rev Replace
gulp.task('build:rev:replace', ['build:rev'], function() {
    var manifest = require('./.tmp/manifest.json');
    return gulp.src(['dist/**/*.{css,html}', 'dist/**/*scripts*'])
        .pipe($.fingerprint(manifest, {
            verbose:true,
            prefix:CDNPrefix,
            regex: /(?:url\(\\?["']?(.+?)\\?['"]?\)|src=\\?["'](.+?)\\?['"]|src=([^\s\>]+)(?:\>|\s)|href=\\?["'](.+?)\\?['"]|href=([^\s\>]+)(?:\>|\s))/g,
        }))
        .pipe(gulp.dest('dist'));
});

// 编译
gulp.task('build', ['header'], function() {
    gulp.start('build:rev:replace');
});

gulp.task('build:test', ['clean'], function() {
    buildMode = 'test';
    CDNPrefix = '/m';
    gulp.start('build');
});

gulp.task('build:test2', ['clean'], function() {
    buildMode = 'test2';
    CDNPrefix = '/m';
    gulp.start('build');
});

gulp.task('build:test3', ['clean'], function() {
    buildMode = 'test3';
    CDNPrefix = '/m';
    gulp.start('build');
});

gulp.task('build:test4', ['clean'], function() {
    buildMode = 'test4';
    CDNPrefix = '/m';
    gulp.start('build');
});

gulp.task('build:test5', ['clean'], function() {
    buildMode = 'test5';
    CDNPrefix = '/m';
    gulp.start('build');
});

gulp.task('build:test6', ['clean'], function() {
    buildMode = 'test6';
    CDNPrefix = '/m';
    gulp.start('build');
});

gulp.task('build:test7', ['clean'], function() {
    buildMode = 'test7';
    CDNPrefix = '/m';
    gulp.start('build');
});

gulp.task('build:test8', ['clean'], function() {
    buildMode = 'test8';
    CDNPrefix = '/m';
    gulp.start('build');
});

gulp.task('build:test9', ['clean'], function() {
    buildMode = 'test9';
    CDNPrefix = '/m';
    gulp.start('build');
});

gulp.task('build:test10', ['clean'], function() {
    buildMode = 'test10';
    CDNPrefix = '/m';
    gulp.start('build');
});

gulp.task('build:test11', ['clean'], function() {
    buildMode = 'test11';
    CDNPrefix = '/m';
    gulp.start('build');
});

gulp.task('build:test12', ['clean'], function() {
    buildMode = 'test12';
    CDNPrefix = '/m';
    gulp.start('build');
});

gulp.task('build:prod', ['clean'], function() {
    buildMode = 'prod';
    CDNPrefix = '//krplus-cdn.b0.upaiyun.com/m';
    gulp.start('build');
});

gulp.task('build:prod:m1', ['clean'], function() {
    buildMode = 'prod';
    CDNPrefix = '//krplus-cdn.b0.upaiyun.com/m1';
    gulp.start('build');
});

//带模拟接口的本地环境
gulp.task('local:mock', function() {
    return gulp.src(config.vendors.concat(config.mocks))
        .pipe($.sourcemaps.init())
        .pipe($.concat('vendor.js'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('.tmp/scripts'))
        .pipe($.size());
});

gulp.task('local', ['watch', 'scripts', 'connect', 'local:mock', 'styles', 'header'], function() {
    gulp.src(config.vendors.concat(config.mocks))
        .pipe($.sourcemaps.init())
        .pipe($.concat('vendor.js'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('.tmp/scripts'))
        .pipe($.size());
    gulp.watch(config.mocks, ['local:mock']);
});

gulp.task('remote', ['watch', 'scripts', 'connect:remote', 'styles', 'header']);

gulp.task('remote:prod', function() {
    buildMode = 'prod';
    apiHost = 'http://rong.36kr.com';
    gulp.start('remote');
});

gulp.task('remote:dev', function() {
    buildMode = 'dev';
    apiHost = 'http://rongdev.36kr.com';
    gulp.start('remote');
});

gulp.task('remote:test', function() {
    buildMode = 'test';
    apiHost = 'http://rongtest01.36kr.com';
    apiHost = 'http://rongtest.36kr.com';
    gulp.start('remote');
});

gulp.task('remote:test2', function() {
    buildMode = 'test2';
    apiHost = 'http://rongtest02.36kr.com';
    gulp.start('remote');
});

gulp.task('remote:test3', function() {
    buildMode = 'test3';
    apiHost = 'http://rongtest03.36kr.com';
    gulp.start('remote');
});

gulp.task('remote:test4', function() {
    buildMode = 'test4';
    apiHost = 'http://rongtest04.36kr.com';
    gulp.start('remote');
});

gulp.task('remote:test5', function() {
    buildMode = 'test5';
    apiHost = 'http://rongtest05.36kr.com';
    gulp.start('remote');
});

gulp.task('remote:test6', function() {
    buildMode = 'test6';
    apiHost = 'http://rongtest06.36kr.com';
    gulp.start('remote');
});

gulp.task('remote:test7', function() {
    buildMode = 'test7';
    apiHost = 'http://rongtest07.36kr.com';
    gulp.start('remote');
});

gulp.task('remote:test8', function() {
    buildMode = 'test8';
    apiHost = 'http://rongtest08.36kr.com';
    gulp.start('remote');
});

gulp.task('remote:test9', function() {
    buildMode = 'test9';
    apiHost = 'http://rongtest09.36kr.com';
    gulp.start('remote');
});

gulp.task('remote:test10', function() {
    buildMode = 'test10';
    apiHost = 'http://rongtest10.36kr.com';
    gulp.start('remote');
});

gulp.task('remote:test11', function() {
    buildMode = 'test11';
    apiHost = 'http://rongtest11.36kr.com';
    gulp.start('remote');
});

gulp.task('remote:test12', function() {
    buildMode = 'test12';
    apiHost = 'http://rongtest12.36kr.com';
    gulp.start('remote');
});

//编译页头
gulp.task('header', function() {
    var headers = {
        test: '//huodong.36kr.com/common-module/common-header-test/script.js',
        test2: '//huodong.36kr.com/common-module/common-header-test2/script.js',
        test3: '//huodong.36kr.com/common-module/common-header-test3/script.js',
        test4: '//huodong.36kr.com/common-module/common-header-test4/script.js',
        test5: '//huodong.36kr.com/common-module/common-header-test4/script.js',
        test6: '//huodong.36kr.com/common-module/common-header-test6/script.js',
        test7: '//huodong.36kr.com/common-module/common-header-test7/script.js',
        test8: '//huodong.36kr.com/common-module/common-header-test8/script.js',
        test9: '//huodong.36kr.com/common-module/common-header-test9/script.js',
        test10: '//huodong.36kr.com/common-module/common-header-test10/script.js',
        test11: '//huodong.36kr.com/common-module/common-header-test11/script.js',
        test12: '//huodong.36kr.com/common-module/common-header-test12/script.js',
        prod: '//krplus-cdn.b0.upaiyun.com/common-module/common-header/script.js',
    };

    return gulp.src(['src/*.html'])
        .pipe($.replace('%%%headerSrc%%%', headers[buildMode]))
        .pipe(gulp.dest('.tmp'));
});
/*字典task*/
gulp.task('dict', function() {
    loadDictionary.loadCityData();
    loadDictionary.loadDictData();
    loadDictionary.loadCFDictData();
    loadDictionary.loadURLDictData();
});

// 默认任务
gulp.task('default', ['serve']);
