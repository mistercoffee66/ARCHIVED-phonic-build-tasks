var gulp = require('gulp'),
		opts = require('../opts'),
		packages = require('../packages'),
		plugins = require('../plugins'),
		utils = require('../utils');

gulp.task('serve', function(done){

	var dest = process.env.buildDirectory || opts.paths.tmp,
		browserSync = packages.browserSync.create();

	browserSync.init({
		server: {
			baseDir: dest
		}
	});

	if (dest !== opts.paths.dist) {
		gulp.watch(
			opts.paths.src + '/**/*.less',
			gulp.series(
				'less:dev',
				browserSync.reload
		));
		gulp.watch(
			opts.paths.src + opts.paths.jsDir + '/_lib/**/*.js',
			gulp.series(
				'concat-js:dev:lib',
				browserSync.reload
		));
		gulp.watch([
			opts.paths.src + '/**/*.js',
			'!' + opts.paths.src + opts.paths.jsDir + '/_lib/**/*.js'
			],
			gulp.series(
				'concat-js:dev:app',
				browserSync.reload
		));
		gulp.watch(
			opts.paths.src + opts.paths.ngTemplates,
			gulp.series(
				'ng-templates',
				'concat-js:dev:app',
				browserSync.reload
		));
	}

	else {
		gulp.watch(
				opts.paths.dist + '/**/*.html',
				browserSync.reload
		);
	}

	done();
});