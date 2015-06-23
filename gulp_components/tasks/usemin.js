/**
 * replaces blocks in index.html with minified and concated assets
 */

var gulp = require('gulp'),
	opts = require('../opts');

gulp.task('usemin', function() {

	opts.logMsg('\n*****' + 'begin usemin task' + '*****\n');

	return gulp.src(opts.src + opts.homepage)

			.pipe(opts.plugins.usemin({
				js: [opts.plugins.ngAnnotate(), opts.plugins.uglify()]
			}))
			.pipe(gulp.dest(opts.dist));
});