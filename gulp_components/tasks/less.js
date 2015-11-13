var gulp = require('gulp'),
	opts = require('../opts');

gulp.task('less', function() {
	opts.logMsg('\n*****' + 'begin less' + '*****\n');

	return gulp.src(opts.paths.src + opts.paths.lessDir + '/main.less')
			.pipe(opts.plugins.sourcemaps.init())
			.pipe(opts.plugins.less({
				plugins: [opts.packages.lessPluginGlob],
				compress: true //compress before adding sourcemap
			}))
			.pipe(opts.plugins.sourcemaps.write('.'))
			.pipe(gulp.dest(opts.paths.tmp + opts.paths.cssDir))
			.on('error', function(error){
				//opts.notifier.notify({'message': error})
				// this is now handled in fix-pipe
				// but the handler has to stay even though it's empty
			});
});

