var gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    typescript = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    tscConfig = require('./tsconfig.json');

var appSrc = '',
    tsSrc = 'app/';

gulp.task('html', function() {
  gulp.src(appSrc + '**/*.html');
});

gulp.task('css', function() {
  gulp.src(appSrc + '**/*.css');
});
    
gulp.task('copylibs', function() {
  return gulp
    .src([
        'node_modules/rxjs/bundles/Rx.umd.js',
        "node_modules/zone.js/dist/zone.js",
        "node_modules/@angular/core/core.umd.js",
        "node_modules/@angular/common/common.umd.js",
        "node_modules/@angular/compiler/compiler.umd.js",
        "node_modules/@angular/platform-browser/platform-browser.umd.js",
        "node_modules/@angular/platform-browser-dynamic/platform-browser-dynamic.umd.js"
    ])
    .pipe(gulp.dest(appSrc + 'js/@angular'));
});

gulp.task('typescript', function () {
  return gulp
    .src(tsSrc + '**/*.ts')
    .pipe(sourcemaps.init())
    .pipe(typescript(tscConfig.compilerOptions))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(appSrc + 'js/'));
});

gulp.task('watch', function() {
  gulp.watch(tsSrc + '**/*.ts', ['typescript']);
  gulp.watch(appSrc + 'css/*.css', ['css']);
  gulp.watch(appSrc + '**/*.html', ['html']);
});

gulp.task('webserver', function() {
  gulp.src(appSrc)
    .pipe(webserver({
      livereload: true,
      open: true
    }));
});

gulp.task('default', ['copylibs', 'typescript', 'watch', 'webserver']);
