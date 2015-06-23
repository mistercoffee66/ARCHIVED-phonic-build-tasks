/**
 * move anything not handled by usemin the dist directory
 */

var gulp = require('gulp'),
	opts = require('../opts');

gulp.task('move', function(){
	opts.logMsg('\n*****' + 'begin move' + '*****\n');
	return gulp.src([opts.src + opts.staticAssets, opts.src + opts.categoryPages],
			{ base: opts.src + '/' })
			.pipe(gulp.dest(opts.dist));
});