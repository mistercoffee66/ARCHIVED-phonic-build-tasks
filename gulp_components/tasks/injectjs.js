/**
 * reference all js files in index.html
 */

var gulp = require('gulp'),
	opts = require('../opts');

gulp.task('injectjsDev' ,function () {

	opts.logMsg('\n*****' + 'begin injectjsDev' + '*****\n');

	var target = gulp.src([opts.src + opts.homepage,opts.src + opts.categoryPages]),
		sources = gulp.src([opts.src + opts.jsDir + '/**/*.js', opts.src + opts.cssDir + '/**/*.css'], {read: false});

	return target.pipe(opts.plugins.inject(sources, {relative: true}))
			.pipe(gulp.dest(opts.src));
});

gulp.task('injectjsDist' ,function () {

	opts.logMsg('\n*****' + 'begin injectjsDist' + '*****\n');

	var target = gulp.src([opts.dist + opts.categoryPages]),
			sources = gulp.src([opts.dist + opts.jsDir + '/**/*.js', opts.dist + opts.cssDir + '/**/*.css'], {read: false});

	return target.pipe(opts.plugins.inject(sources, {relative: true}))
			.pipe(gulp.dest(opts.dist));
});