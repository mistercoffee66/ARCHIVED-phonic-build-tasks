/**
 * move and minify images
 */

var gulp = require('gulp'),
		opts = require('../opts'),
		packages = require('../packages'),
		plugins = require('../plugins'),
		utils = require('../utils');

gulp.task('images:dev',function(){

	utils.logImportant('begin images:dev task');

	var dest = process.env.buildDirectory || opts.paths.tmp;

	return gulp.src(opts.paths.src + opts.paths.imgDir + '/**/*')
			.pipe(gulp.dest(dest + opts.paths.imgDir));
});


gulp.task('images:dist:noGif',function(){

	var dest = process.env.buildDirectory || opts.paths.tmp;

	return gulp.src(opts.paths.src + opts.paths.imgDir + '/**/*.{jpg,jpeg,png,svg}')
			.pipe(plugins.imagemin(
				{
					use: [
						packages.imageminJpegRecompress({
							quality: 'very high',
							target:.9999,
							min: 40,
							max: 80,
							progressive: false
						})]
				}
			))
			.pipe(gulp.dest(dest + opts.paths.imgDir));
});

gulp.task('images:dist:gif',function(){

	var dest = process.env.buildDirectory || opts.paths.tmp;

	return gulp.src(opts.paths.src + opts.paths.imgDir + '/**/*.gif')
			.pipe(gulp.dest(dest + opts.paths.imgDir));
});

gulp.task('images:dist', gulp.series(
		function(done){
			utils.logImportant('begin images:dist task');
			done();
		},
		gulp.parallel(
				'images:dist:noGif',
				'images:dist:gif'
		)
));