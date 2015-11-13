var gulp = require('gulp'),
	opts = require('./gulp_components/opts');

/**
 * prevents gulp from exiting on stream errs
 * https://github.com/gulpjs/gulp/issues/71
 */
//require('./gulp_components/fix-pipe');

opts.packages.requireDir(__dirname + '/gulp_components/tasks');

gulp.task('log', function(done){
	console.log('logging!');
	console.log(process.cwd());
	done();
});

gulp.task('default', gulp.series('less'));


