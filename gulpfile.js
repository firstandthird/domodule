/* eslint no-console: 0 */

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const babel = require('gulp-babel');
const browserSync = require('browser-sync');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');

gulp.task('browser-sync', () => {
  browserSync({
    server: {
      baseDir: './',
      index: 'example/index.html'
    }
  });
});

gulp.task('bs-reload', () => {
  browserSync.reload();
});

gulp.task('scripts', () =>
  gulp.src(['lib/*.js'])
    .pipe(plumber({
      errorHandler: error => {
        console.log(error.message);
        this.emit('end');
      }
    }))
    .pipe(babel())
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({
      stream: true
    }))
);

  // The test file uses import so we need to babelify it.
gulp.task('scripts-example', () => {
  const b = browserify({
    entries: ['example/test.js'],
    debug: true,
    transform: [['babelify', { presets: ['es2015'] }]]
  });

  return b.bundle()
          .pipe(source('test.js'))
          .pipe(buffer())
          .pipe(gulp.dest('example/dist/'))
          .pipe(browserSync.reload({
            stream: true
          }));
});

gulp.task('default', ['browser-sync', 'scripts', 'scripts-example'], () => {
  gulp.watch(['lib/*.js'], ['scripts', 'scripts-example']);
  gulp.watch(['example/*.js'], ['scripts-example']);
  gulp.watch('example/*.html', ['bs-reload']);
});
