var fileinclude = require('gulp-file-include'),
    gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    serve = require('gulp-serve'),
    series = require('stream-series'),
    inject = require('gulp-inject'),
    watch = require('gulp-watch'),
    batch = require('gulp-batch'),
    clean = require('gulp-clean'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    cleanCSS = require('gulp-clean-css'),
    uncss = require('gulp-uncss'),
    debug = require('gulp-debug'),
    vendorCss = ['./bower_components/bootstrap-css-only/css/bootstrap.css'],
    appCss = [
      './src/css/carousel.css', 
      './src/css/main.css'
    ],
    images = ['./src/images/**/*'],
    appJs = [
      './src/js/app.js',
      './src/js/config.js',
      './src/js/loader.js',
      './src/js/controllers/main.js',
      './src/js/services/services.js',
      './src/js/directives/directives.js'
    ],
    vendorJs = [
      './bower_components/angular/angular.js', 
      './bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      './bower_components/angular-resource/angular-resource.js', 
      './bower_components/angular-ui-router/release/angular-ui-router.js'
    ],
    angularTemplates = [
      './src/templates/*.html'
    ];

var getFileNameFromPath = function(filePath) {
  var fileName = filePath.split('/').pop();
  return './dist/' + fileName.split('.').pop() + '/' + fileName;
};

gulp.task('serve', serve('./dist'));
 
gulp.task('fileinclude', ['move'], function() {
  return gulp.src(['src/**/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: './partials/'
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function () {
  watch(['./src/**/*', './partials/**/*'], batch(function (events, done) {
    gulp.start('build', done); //reruns serve, but maybe thats OK
  }));
});
 
gulp.task('injectCss', ['move', 'fileinclude'], function () {
  var options = {
    relative: true
    // ,
    // transform: function (filePath, file) {
    //   // return file contents as string 
    //   return file.contents.toString('utf8')
    // }
  };

  var cssStream = gulp.src(vendorCss.concat(appCss))
    .pipe(concat('all.css'))
    .pipe(uncss({
      html: ['./dist/*.html']
    }))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./dist/css/'));

  return gulp.src('./dist/*.html')
    .pipe(inject(cssStream, options))
    .on('error', console.log) // This will always inject vendor files before app files 
    .pipe(gulp.dest('./dist'));
});

gulp.task('injectVendorJs', ['injectCss'], function() {
  var options = {
    relative: true,
    starttag: '<!-- inject:vendor:js -->'
  };

  var vendorStream = gulp.src(vendorJs)
    // .pipe(uglify())
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./dist/js/'));

  return gulp.src('./dist/*.html')
    .pipe(inject(series(vendorStream), options))
    .on('error', console.log)
    .pipe(gulp.dest('./dist'));
});

gulp.task('injectAppJs', ['injectVendorJs'], function() {
  var options = {
    relative: true,
    starttag: '<!-- inject:app:js -->'
  };

  var appStream = gulp.src(appJs)
    .pipe(uglify())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./dist/js/'));

  return gulp.src('./dist/*.html')
    .pipe(inject(series(appStream), options))
    .on('error', console.log)
    .pipe(gulp.dest('./dist'));
});
 
gulp.task('move', ['clean'], function () {
  gulp.src(images)
    .pipe(gulp.dest('./dist/images/'));
  gulp.src(angularTemplates)
    .pipe(gulp.dest('./dist/templates/'));
});

gulp.task('clean', function () {
  return gulp.src(['./dist/**/*.html', './dist/**/*.js', './dist/**/*.css'], {read: false, force: true})
    .pipe(clean());
});

gulp.task('build', ['clean', 'move', 'fileinclude', 'injectCss', 'injectVendorJs', 'injectAppJs']);
gulp.task('dev', ['build', 'serve', 'watch']);
// gulp.task('foo', function () { console.log('TODO!'); });
