/**
 * minify html
 */

var gulp = require('gulp'),
	opts = require('../opts');

gulp.task('htmlmin', function () {
	opts.logMsg('\n*****' + 'begin htmlmin' + '*****\n');
	return gulp.src([opts.dist + opts.homepage, opts.dist + opts.categoryPages])
			.pipe(opts.plugins.htmlmin({
				removeComments: true,
				collapseWhitespace: true,
				preserveLineBreaks: true
			}))
			.pipe(gulp.dest(opts.dist));
});