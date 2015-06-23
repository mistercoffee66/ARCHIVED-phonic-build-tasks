/**
 * convert html templates to ng js modules
 */

var gulp = require('gulp'),
	opts = require('../opts');

gulp.task('ng-templates',function(){
	opts.logMsg('\n*****' + 'begin ng-templates' + '*****\n');
	return gulp.src(opts.src + opts.ngTemplates)
			.pipe(opts.plugins.ngHtml2js({
				moduleName: "ibmnww",
				declareModule: false
			}))
			.pipe(gulp.dest(opts.src + opts.jsDir + '/templates'));
});