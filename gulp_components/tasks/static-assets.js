/**
 * move uncompiled assets, like video, pdf etc
 */

var gulp = require('gulp'),
		opts = require('../opts'),
		packages = require('../packages'),
		plugins = require('../plugins'),
		utils = require('../utils');

gulp.task('static-assets',function(){

	var dest = process.env.buildDirectory || opts.paths.tmp;

	return gulp.src(opts.paths.src + opts.paths.staticAssetsDir + '/**/*')
			.pipe(gulp.dest(dest + opts.paths.staticAssetsDir));
});