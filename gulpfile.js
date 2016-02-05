var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    util = require('gulp-util'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    rimraf = require('rimraf'),
    ngAnnotate =require('gulp-ng-annotate'),
    uglify = require('gulp-uglify'),
    addStream = require('add-stream'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    insert = require('gulp-insert'),
    wrap = require('gulp-wrap'),
    templateCache = require('gulp-angular-templatecache'),
    replace = require('gulp-replace'),
    zip = require('gulp-zip'),
    ftp = require('gulp-ftp')

//this is the optional command line argument:
var argv = require('yargs').argv;

///////////
// PATHS
//////////

var config = require('./config.json'),
    VENDOR_SCRIPTS = config.VENDOR_SCRIPTS,
    STYLE_SCRIPTS = config.STYLE_SCRIPTS,
    PATHS, DIST;

if(argv.dist){
    PATHS = config.PATHS[argv.dist];
    DIST = true
}
else{
    PATHS = config.PATHS.local;
    DIST = false;
}

var log = function(msg){
    util.log(util.colors.green(msg))
};

////////////
// tasks
////////////

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

//This function generates a string to append to functions.php
//to enqueue scripts
function vendors(){
    var glob = [],
        suffix,
        register = '',
        enqueue = '';

    //if for dist, we register a concatenated vendor min file.
    if(DIST){
        suffix = '.min.js';
        register +=
            'wp_register_script(\n"' +
            'vendors' +
            '",\n get_template_directory_uri().' +
            '"/js/vendor/vendors.min.js"); \n';
        enqueue +=
            'wp_enqueue_script(\n"' +
            'vendors");\n';
    }
    else {
        suffix = '.js';
    }

    for(var file in VENDOR_SCRIPTS){
        if(VENDOR_SCRIPTS.hasOwnProperty){
            var path = VENDOR_SCRIPTS[file]+suffix;
            glob.push('bower_components/'+path);

    //if not for dist, we register every single vendor file.
            if(!DIST){
                register +=
                    'wp_register_script(\n"' +
                    file +
                    '",\n get_template_directory_uri().' +
                    '"/js/vendor/' + file+suffix +'"); \n';
                enqueue +=
                    'wp_enqueue_script("' +
                    file + '");\n';
            }
        }
    };
    for (var key in STYLE_SCRIPTS){
        if(STYLE_SCRIPTS.hasOwnProperty(key)){
            register +=
                'wp_register_style(\n"' +
                key + '",\n' +
                'get_template_directory_uri().' +
                '"'+ STYLE_SCRIPTS[key] +'");\n';
            enqueue +=
                'wp_enqueue_style("' +
                key + '");\n'
        }
    };

    register +=
        'wp_register_script(\n"app",\n ' +
        'get_template_directory_uri().' +
        '"/js/app.js"); \n' +
        'wp_register_style("style",' +
        'get_stylesheet_uri());\n \n';
    enqueue +=
        'wp_enqueue_script(\n' +
        '"app");\n' +
        'wp_enqueue_style("style");\n';

    return {
        'fn' :
            'function pr_scripts_styles(){\n' +
            register + enqueue + '\n};',
        'glob' : glob
    }
}

function prepareTemplates(){
        return gulp.src('src/tpl/*.tpl.html')
        .pipe(templateCache({standalone: true}))
}

//TODO: get clean task to work
gulp.task('clean', function(cb){
    log('cleaning files..');
    if(true){
        rimraf('./dist', cb)
    }
});

gulp.task('scripts', function() {
log('building js');
    gulp.src('src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
//This will append the 'jsified' angular templates
        .pipe(addStream.obj(prepareTemplates()))
        .pipe(ngAnnotate())
        .pipe(replace('%%API_KEY%%', config.API_KEY))
        .pipe(replace('%%THEME_URL%%', config.THEME_URL))
        .pipe(replace('%%ABS_URL%%', PATHS.ABS_URL))
        .pipe(concat('app.js'))
        .pipe(gulpif(DIST, uglify({mangle: false})))
        .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
        .pipe(gulp.dest(PATHS.themeFolder+'js/'))
});

gulp.task('vendor-scripts', function() {
    var vend = vendors();
    gulp.src(vend.glob)
        .pipe(gulpif(DIST, concat('vendors.min.js')))
        .pipe(gulp.dest(PATHS.themeFolder+'js/vendor/'));
    gulp.src('src/functions.php')
        .pipe(insert.append(vend.fn))
        .pipe(gulp.dest(PATHS.themeFolder));
});

gulp.task('styles', function() {
    log('building CSS');
    gulp.src(['src/scss/*.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(replace('%%THEME_URL%%', config.THEME_URL))
        .pipe(concat('style.css'))
        .pipe(autoprefixer())
        .pipe(gulpif(DIST, minifyCss()))
        .pipe(gulp.dest(PATHS.themeFolder));
});

gulp.task('assets', function(){
    log('copying assets');
    gulp.src('./src/assets/**/*.*')
        .pipe(gulp.dest(PATHS.themeFolder+'assets/'))
});

gulp.task('plugin', function(){
    gulp.src('./src/plugin/*.php')
        .pipe(gulp.dest(PATHS.pluginFolder));
});

gulp.task('index', ['scripts', 'vendor-scripts', 'styles', 'assets', 'plugin'], function() {
    gulp.src(['./src/*.php', '!./src/functions.php'])
        .pipe(replace('%%API_KEY%%', config.API_KEY))
        .pipe(replace('%%THEME_URL%%', config.THEME_URL))
        .pipe(replace('%%BASE_HREF%%', PATHS.BASE_HREF))
        .pipe(replace('%%TERMS%%', PATHS.TERMS))
        .pipe(replace('%%ABOUT%%', PATHS.ABOUT))
        .pipe(gulp.dest(PATHS.themeFolder));
});

gulp.task('watch', ['index'], function(){
    gulp.watch('src/**/*.js', ['scripts']);
    gulp.watch('src/**/*.tpl.html', ['scripts']);
    gulp.watch(['src/scss/**/*.scss', 'src/scss/modules/*.scss'], ['styles']);
    gulp.watch('src/plugin/*.php', ['plugin']);
    gulp.watch('src/*.php', ['index']);
    gulp.watch('src/assets/**/*.*', ['assets']);
    gulp.watch('src/config.json', ['vendor-scripts']);
});

gulp.task('distribute', ['index'], function(){
    log('creating zip...');
    gulp.src('./dist/karine')
    .pipe(zip('karine.zip'))
    .pipe(gulp.dest('dist'));

    log('uploading to server...')
    gulp.src('./dist/karine.zip')
    .pipe(ftp(PATHS.ftp))
    .pipe(util.noop());
})

gulp.task('zip', function(){
    log('creating zip...');
    gulp.src('./dist/karine')
    .pipe(zip('karine.zip'))
    .pipe(gulp.dest('dist'));
})
