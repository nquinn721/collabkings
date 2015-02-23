	
// include the required packages. 
var gulp = require('gulp');
var stylus = require('gulp-stylus');
var wat
 
 
// include, if you want to work with sourcemaps 
var sourcemaps = require('gulp-sourcemaps');

gulp.task('style', function () {
  gulp.src(__dirname +'/../client/public/style/main.styl')
    .pipe(stylus({
      compress: true
    }))
    .pipe(gulp.dest(__dirname +'/../client/public/css'));
});

// External sourcemaps 
gulp.task('sourcemaps-external', function () {
  gulp.src(__dirname +'/../client/public/style/main.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(__dirname +'/../client/public/css'));
});



gulp.task('watch', function () {
    gulp.watch([__dirname + '/../client/public/style/*.styl'], ['style', 'sourcemaps-external']);
});

// Default gulp task to run 
gulp.task('default', ['style']);
 

