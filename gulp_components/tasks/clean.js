/**
 * empty the dist directory
 */

var gulp = require('gulp'),
	opts = require('../opts');

gulp.task('clean', function (cb) {
	opts.logMsg('\n*****' + 'begin clean' + '*****\n');
	return opts.packages.del(['dist/**/*'], cb);
});