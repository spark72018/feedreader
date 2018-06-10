const gulp = require('gulp');
const browserSync = require('browser-sync').create();

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
});

gulp.task('watch', ['browserSync'], function() {
  gulp.watch('jasmine/spec/*.js', browserSync.reload);
  gulp.watch('js/*.js', browserSync.reload);
  gulp.watch('css/*.css', browserSync.reload);
  gulp.watch('*.html', browserSync.reload);
});
