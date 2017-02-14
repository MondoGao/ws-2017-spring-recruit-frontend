let Gulp = require('gulp');
let GulpImagemin = require('gulp-imagemin');

let build = require('./build/build');

Gulp.task('copy', function () {
  Gulp.src('app/img/**/*')
    .pipe(GulpImagemin())
    .pipe(Gulp.dest('dist/img'));
  Gulp.src('app/**/*.html')
    .pipe(Gulp.dest('dist/'));
});
Gulp.task('webpack', function () {
  build.build();
});
Gulp.task('default', ['copy', 'webpack']);