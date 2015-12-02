/**
 * concat js to lib and app
 */

var gulp = require('gulp'),
		opts = require('../opts'),
		packages = require('../packages'),
		plugins = require('../plugins'),
		utils = require('../utils');

gulp.task('concat-js:dev:lib',function(){

	var dest = process.env.buildDirectory || opts.paths.tmp;

	return gulp.src([
				dest + opts.paths.jsDir + '/_lib/bower.js',
				opts.paths.src + opts.paths.jsDir + '/_lib/**/*.js'
			])
		//.pipe(plugins.print())
			.pipe(plugins.sourcemaps.init())
			.pipe(plugins.concat('_lib.min.js'))
			.pipe(plugins.sourcemaps.write('.'))
			.pipe(gulp.dest(dest + opts.paths.jsDir));
});

gulp.task('concat-js:dev:app',function(){

	var dest = process.env.buildDirectory || opts.paths.tmp;

	return gulp.src(
		[
			opts.paths.src + '/**/*.js',
			'!' + opts.paths.src + opts.paths.jsDir + '/_lib/**/*.js',
			dest + opts.paths.jsDir + '/app/templates.js',
			dest + opts.paths.jsDir + '/app/environment-config.js'
		])
		//.pipe(plugins.print())
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.concat('app.min.js'))
		.pipe(plugins.sourcemaps.write('.'))
		.pipe(gulp.dest(dest + opts.paths.jsDir));
});

gulp.task('concat-js:dist:lib',function(){

	var dest = process.env.buildDirectory || opts.paths.tmp;

	return gulp.src([
		dest + opts.paths.jsDir + '/_lib/bower.js',
		opts.paths.src + opts.paths.jsDir + '/_lib/**/*.js'
	])
		.pipe(plugins.concat('_lib.min.js'))
		.pipe(plugins.ngAnnotate())
		.pipe(plugins.uglify())
		.pipe(gulp.dest(dest + opts.paths.jsDir));
});

gulp.task('concat-js:dist:app',function(){

	var dest = process.env.buildDirectory || opts.paths.tmp;

	return gulp.src(
		[
			opts.paths.src + '/**/*.js',
			'!' + opts.paths.src + opts.paths.jsDir + '/_lib/**/*.js',
			dest + opts.paths.jsDir + '/app/templates.js',
			dest + opts.paths.jsDir + '/app/environment-config.js'
		])
		//.pipe(plugins.print())
		.pipe(plugins.concat('app.min.js'))
		.pipe(plugins.ngAnnotate())
		.pipe(plugins.uglify())
		.pipe(gulp.dest(dest + opts.paths.jsDir));
});

gulp.task('concat-js:cleanup',function(done){

	var dest = process.env.buildDirectory || opts.paths.tmp;

	opts.fs.remove(dest + opts.paths.jsDir + '/app');

	done();
});

gulp.task('concat-js:dev', gulp.series(
	function(done){
		utils.logImportant('begin concat-js:dev');
		done();
	},
	gulp.parallel(
		'concat-js:dev:lib',
		'concat-js:dev:app'
	)
));

gulp.task('concat-js:dist', gulp.series(
		function(done){
			utils.logImportant('begin concat-js:dist');
			done();
		},
		gulp.parallel(
				'concat-js:dist:lib',
				'concat-js:dist:app'
		),
		'concat-js:cleanup'
));
