/**
 * move anything not handled by usemin the dist directory
 */

var gulp = require('gulp'),
	opts = require('../opts');

gulp.task('imagemin', function(){
	opts.logMsg('\n*****' + 'begin imagemin' + '*****\n');
	return gulp.src([opts.src + opts.imgDir + '/**/*.{jpg,jpeg,png,svg}'])
			.pipe(opts.plugins.imagemin(
					{
						use: [
							opts.packages.imageminJpegRecompress({
								quality: 'very high',
								target:.9999,
								min: 40,
								max: 80,
								progressive: false
							})]
					}
			))
			.pipe(gulp.dest(opts.dist + opts.imgDir));
});