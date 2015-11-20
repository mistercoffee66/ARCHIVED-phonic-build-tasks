/**
 * move and minify images
 */

var gulp = require('gulp'),
		opts = require('../opts'),
		packages = require('../packages'),
		plugins = require('../plugins'),
		utils = require('../utils');

gulp.task('images:dev',function(){

	var dest = process.env.buildDirectory || opts.paths.tmp;

	return gulp.src(opts.paths.src + opts.paths.imgDir + '/**/*')
			.pipe(gulp.dest(dest + opts.paths.imgDir));
});


//TODO dist