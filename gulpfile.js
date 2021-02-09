'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
const jsdoc = require('gulp-jsdoc3');
const eslint = require('gulp-eslint');

sass.compiler = require('node-sass');

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function () {
  return gulp.src("./style/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("./style"))
    .pipe(browserSync.stream());
});

gulp.task('doc', function (cb) {
  const config = require('./jsdocCustom.json');
  gulp.src(['README.md', './js/*.js'], { read: false })
    .pipe(jsdoc(config, cb));
});

gulp.task('lint', () => {
  gulp.src(['./js/*.js', '!node_modules/**'])
    .pipe(eslint({
      rules: {
        'my-custom-rule': 1,
        'strict': 2
      },
      globals: [
        'jQuery',
        '$'
      ],
      envs: [
        'browser'
      ]
    }))
    .pipe(eslint.formatEach('compact', process.stderr));
});

// Static Server + watching scss/html files
gulp.task('serve', gulp.series(['sass'], gulp.series(['doc']), function () {

  browserSync.init({
    server: "./"
  });

  gulp.watch("./style/*.scss", gulp.series(['sass']));
  gulp.watch('./js/*.js', gulp.series(['doc']));
  //Quité la tarea lint de la llamada inicial porque detenía las tareas watch
  gulp.watch('./js/*.js', gulp.parallel(['lint']));
  gulp.watch("./*.html").on('change', browserSync.reload);
  gulp.watch("./js/*.js").on('change', browserSync.reload);
}));

gulp.task('default', gulp.series(['serve']));