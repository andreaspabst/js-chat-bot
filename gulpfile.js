var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var minifycss = require('gulp-clean-css');
var minify = require('gulp-minify');
var copy = require('gulp-copy');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cache = require('gulp-cache');
var sourcemaps = require('gulp-sourcemaps');

var sourcePath = 'src/';
var buildPath = 'build/';

var config = {
    styles:  sourcePath + 'scss/*.scss',
    images:  sourcePath + 'images/**/*',
    scripts: sourcePath + 'js/*.js'
};

// Styles
gulp.task('styles', function() {
    return gulp.src(config.styles)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('css'));
});

// Styles Production
gulp.task('styles-prod', function() {
    return gulp.src(config.styles)
        .pipe(sass())
        .pipe(rename('build.css'))
        .pipe(autoprefixer())
        .pipe(minifycss())
        .pipe(gulp.dest(buildPath+'css'));
});

// Scripts
gulp.task('scripts-prod', function() {
    return gulp.src([
        sourcePath+"js/*.js"
    ])
    .pipe(concat('chat.js'))
    .pipe(gulp.dest(buildPath+'js'));
});

gulp.task('scripts-prod-min', function() {
    return gulp.src([
        sourcePath+"js/*.js"
    ])
    .pipe(concat('chat-min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(buildPath+'js'));
});


// Watch
gulp.task('watch', function() {
    gulp.watch(sourcePath + 'scss/**/*.scss', ['styles']);
    gulp.watch(sourcePath + 'js/**/*.js', ['scripts']);
});

// Clear cache (manual execution)
gulp.task('clear', function () {
    return cache.clearAll();
});

gulp.task('default', ['watch', 'styles' ]);

gulp.task('build', ['scripts-prod', 'scripts-prod-min', 'styles-prod' ]);