var gulp = require('gulp'),
    webserver = require('gulp-webserver'),

    browserify = require('browserify'),
    reactify = require('reactify'),
    babelify = require('babelify'),

    source = require('vinyl-source-stream'),

    es = require('event-stream'),
    sass = require('gulp-sass'),

    uglify = require('gulp-uglify');

/**
 * Build happens in two phases:
 * 1) Stage - copies/compiles all various less, js, css, etc. files from libs and src folder to 'link' folder for final packaging
 * 2) Link - finalizes files, by compiling less files, browserifying, minifying, etc. into the final 'dist' folder
 */

var bundleLibrary = function(entryFile, targetFile, destination) {
    return browserify()
                .add(entryFile)
                .bundle()
                .pipe(source(targetFile))
                .pipe(gulp.dest(destination));
};

/* LIBRARIES */

gulp.task('jquery', function() {
    return gulp.src('./node_modules/jquery/dist/jquery.js')
               .pipe(gulp.dest('./app/link/js'));
});

/* STAGING TASKS */

gulp.task('html', function() {
    return gulp.src('./app/src/html/index.html')
               .pipe(gulp.dest('./app/dist'));
});

gulp.task('js', function() {
    return es.merge(
        gulp.src('./app/libs/**/*.js')
            .pipe(gulp.dest('./app/link/js')),
        gulp.src('./app/src/js/**/*.js')
            .pipe(gulp.dest('./app/link/js'))
    );
});

gulp.task('sass', function() {
    return gulp.src('./app/src/sass/**/*.*')
        .pipe(gulp.dest('./app/link/sass'));
});

gulp.task('favicon', function() {
    return es.merge(
        gulp.src('./app/src/favicon/**/*.*')
            .pipe(gulp.dest('./app/dist/favicon')),
        gulp.src('./app/src/favicon/favicon.ico')
            .pipe(gulp.dest('./app/dist'))
    );
});

/* LINK TASKS */

gulp.task('link-js', ['stage'], function() {
    return browserify()
                .add('./app/link/js/main.js')
                .transform(reactify, {es6: true})
                .transform(babelify)
                .bundle()
                .on('error', function(err) {
                    console.error(err);
                })
                .pipe(source('main.js'))
                .pipe(gulp.dest('./app/dist/js'));
});

gulp.task('link-sass', ['stage'], function() {
    return gulp.src('./app/link/sass/main.scss')
        .pipe(sass())
        .pipe(gulp.dest('./app/dist/css'));
});

/* BUILD PHASES */

gulp.task('libs', ['jquery']);

gulp.task('stage', ['libs', 'html', 'sass', 'js', 'favicon']);

gulp.task('link', ['stage', 'link-js', 'link-sass']);

/* SERVER & BROWSER TASKS */

gulp.task('server', ['link'], function() {
    return gulp.src('./app/dist')
               .pipe(webserver({
                    livereload: false,
                    directoryListing: false,
                    open: true
                }));
});

gulp.task('watch', ['link'], function() {
    return gulp.watch('./app/src/**/*.*', ['link']);
});

gulp.task('default', ['link']);

gulp.task('serve', ['server', 'watch']);