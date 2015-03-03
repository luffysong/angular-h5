var istanbul = require('browserify-istanbul');

module.exports = function (karma) {
    karma.set({
        basePath: './',
        frameworks: ['mocha', 'chai', 'browserify'],
        files: [
            '.tmp/scripts/modernizr.js',
            '.tmp/scripts/vendor.js',
            'src/components/angular-mocks/angular-mocks.js',
            'src/scripts/default.js',
            'src/templates/**/*.html',
            'test/karma/**/*.js'
//      'test/karma/services/**/*.js'
        ],
        junitReporter: {
            outputFile: 'test-results.xml'
        },
        browsers: ['PhantomJS'],
        preprocessors: {
            'src/scripts/**/*.js': ['coverage', 'browserify'],
            'src/templates/**/*.html': 'ng-html2js'
        },
        reporters: ['spec', 'coverage', 'junit', 'html'],
        browserify: {
            debug: true,
            transform: ['browserify-shim', istanbul({
                ignore: ['**/node_modules/**', '**/test/**'],
                defaultIgnore: true
            })]
        },
        htmlReporter: {
            outputDir: 'karma_html',
            templatePath: __dirname + '/test/karma/jasmine_template.html'
        },
        logLevel: 'error',
        autoWatch: true,
        coverageReporter: {
            dir: '.',
            reporters: [
                {type: 'html', subdir: 'report-html'},
                {type: 'text', subdir: '.'},
                {type: 'text-summary', subdir: '.'}
            ]
        }
    });
};
