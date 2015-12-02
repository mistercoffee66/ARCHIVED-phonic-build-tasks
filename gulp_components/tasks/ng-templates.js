/**
 * convert html templates to ng js modules
 */

var gulp = require('gulp'),
		opts = require('../opts'),
		packages = require('../packages'),
		plugins = require('../plugins'),
		utils = require('../utils');

gulp.task('ng-templates',function(){
	utils.logImportant('begin ng-templates');

	var dest = process.env.buildDirectory || opts.paths.tmp;

	return gulp.src(opts.paths.src + opts.paths.ngTemplates)
			.pipe(plugins.angularTemplatecache({
				module: 'phonic',
				filename: "app/templates.js"
			}))
			.pipe(gulp.dest(dest + opts.paths.jsDir));
});