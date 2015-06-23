var gulp = require('gulp'),
	opts = require('../opts');

gulp.task('less', function() {
	opts.logMsg('\n*****' + 'begin less' + '*****\n');
	return gulp.src(opts.src + opts.cssDir + '/less/**/main.less')
			.pipe(opts.plugins.sourcemaps.init())
			.pipe(opts.plugins.less({
				compress: true //compress before adding sourcemap
			}))
			.pipe(opts.plugins.sourcemaps.write('.'))
			.pipe(gulp.dest(opts.src + opts.cssDir))
			.on('error', function(error){
				//opts.notifier.notify({'message': error})
				// this is now handled in fix-pipe
				// but the handler has to stay even though it's empty
			});
});

gulp.task('lessIE', function() {
	opts.logMsg('\n*****' + 'begin lessIE' + '*****\n');
	return gulp.src(opts.src + opts.cssDir + '/less/**/ie8.less')
			.pipe(opts.plugins.less({
				compress: true //compress before adding sourcemap
			}))
			.pipe(gulp.dest(opts.src + opts.cssDir))
			.on('error', function(error){
				//opts.notifier.notify({'message': error})
				// this is now handled in fix-pipe
				// but the handler has to stay even though it's empty
			});
});