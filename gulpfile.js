var gulp = require('gulp'),
    babel = require('gulp-babel'),
    watch = require('gulp-watch');

gulp.task('babel', function () {
  var babel_stream = babel();

  babel_stream.on('error', function (err) {
    console.log('[gulp-babel] error\n', err);
    babel_stream.end();
  });

  return gulp.src('src/**/*.js')
    .pipe(babel_stream)
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
  gulp.watch('src/**/*.js', ['babel']);
});

gulp.task('default', function () {
  console.log('Run either gulp its babel or watch task.');
});