var gulp = require('gulp'),
		opts = require('../opts'),
		packages = require('../packages'),
		plugins = require('../plugins'),
		utils = require('../utils');

gulp.task('less:dev', function() {

	var dest = process.env.buildDirectory || opts.paths.tmp;

	utils.logImportant('begin less:dev');

	return gulp.src(opts.paths.src + opts.paths.lessDir + '/main.less')
			.pipe(plugins.sourcemaps.init())
			.pipe(plugins.less({
				compress: true,
				plugins: [packages.lessPluginGlob]
			}))
			.pipe(plugins.sourcemaps.write('.'))
			.pipe(gulp.dest(dest + opts.paths.cssDir));
});

gulp.task('less:dist', function() {

	var dest = process.env.buildDirectory || opts.paths.dist;

	utils.logImportant('begin less:dist');

	return gulp.src(opts.paths.src + opts.paths.lessDir + '/main.less')
			.pipe(plugins.less({
				compress: true,
				plugins: [packages.lessPluginGlob]
			}))
			.pipe(gulp.dest(dest + opts.paths.cssDir));
});