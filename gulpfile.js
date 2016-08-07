'use strict';

/* common */
const gulp = require('gulp');
const rename = require('gulp-rename');
const clean = require('gulp-clean');
const sequence = require('run-sequence');
/* debugging */
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
/* style */
const sass = require('gulp-sass');
const csscomb = require('gulp-csscomb');
const csso = require('gulp-csso');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
/* js */
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');

const handleError = (error) => {
    notify({
        title: 'Compile error!',
        message: '<%= error.message %>'
    }).write(error);
};

gulp.task('style', () => {
    const processors = [
        autoprefixer({
            browsers: ['last 2 versions']
        })
    ];

    return gulp.src('src/sass/index.sass')
        .pipe(plumber({
            errorHandler: handleError
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(csscomb('csscomb.json'))
        .pipe(csso())
        .pipe(rename({
            basename: 'progress',
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('js', () => {
    return gulp.src('src/js/index.js')
        .pipe(babel({
            presets: ['es2015'],
            plugins: ['transform-class-properties']
        }))
        .pipe(rename({
            basename: 'progress',
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('clean', () => {
    return gulp.src('public/', { read: false })
        .pipe(clean());
});

gulp.task('watch', () => {
    /* style watch */
    gulp.watch('src/sass/**/*.{scss,sass}', ['style']);
    /* js watch */
    gulp.watch('src/js/**/*.js', ['js']);
});

gulp.task('build', () => {
    sequence('clean', ['style', 'js']);
});

gulp.task('default', ['watch']);