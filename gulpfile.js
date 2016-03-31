const gulp = require('gulp');
const plumber = require('gulp-plumber');
const babel = require('gulp-babel');
const browserSync = require('browser-sync');

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
  gulp.src(['index.js', 'lib/*.js'])
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

gulp.task('scripts-example', () =>
  gulp.src(['example/example.js'])
    .pipe(plumber({
      errorHandler: error => {
        console.log(error.message);
        this.emit('end');
      }
    }))
    .pipe(babel())
    .pipe(gulp.dest('example/dist/'))
    .pipe(browserSync.reload({
      stream: true
    }))
);

gulp.task('default', ['browser-sync', 'scripts', 'scripts-example'], () => {
  gulp.watch(['index.js', 'lib/*.js'], ['scripts']);
  gulp.watch(['example/example.js'], ['scripts-example']);
  gulp.watch('example/*.html', ['bs-reload']);
});
