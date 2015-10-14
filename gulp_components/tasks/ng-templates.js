/**
 * convert html templates to ng js modules
 */

var gulp = require('gulp'),
		opts = require('../opts');

gulp.task('ng-templates',function(done){
	opts.logMsg('\n*****' + 'begin ng-templates' + '*****\n');

	//clean out the directory then make the new templates
/*	opts.fs.emptyDir(opts.src + opts.jsDir + '/templates', function(err) {
		gulp.src(opts.src + opts.ngTemplates)
				.pipe(opts.plugins.ngHtml2js({
					moduleName: "ibmnww",
					declareModule: false
				}))
				.pipe(gulp.dest(opts.src + opts.jsDir + '/templates'));
		done();
	});*/

	return 	gulp.src(opts.src + opts.ngTemplates)
			.pipe(opts.plugins.ngHtml2js({
				moduleName: "ibmnww",
				declareModule: false
			}))
			.pipe(gulp.dest(opts.src + opts.jsDir + '/templates'));
});
