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
			.pipe(plugins.concat('_lib.js'))
			.pipe(plugins.sourcemaps.write('.'))
			.pipe(gulp.dest(dest + opts.paths.jsDir));
});

gulp.task('concat-js:dev:app',function(){

	var dest = process.env.buildDirectory || opts.paths.tmp;

	return gulp.src([
		dest + opts.paths.jsDir + '/app/templates.js',
		opts.paths.src + '/**/*.js',
		'!' + opts.paths.src + opts.paths.jsDir + '/_lib/**/*.js'
	])
			//.pipe(plugins.print())
			.pipe(plugins.sourcemaps.init())
			.pipe(plugins.concat('app.js'))
			.pipe(plugins.sourcemaps.write('.'))
			.pipe(gulp.dest(dest + opts.paths.jsDir));
});

/*gulp.task('concat-js:dist:lib',function(){

	var dest = process.env.buildDirectory || opts.paths.tmp;

	return gulp.src(opts.paths.src + opts.paths.jsDir + '/_lib/!**!/!*.js')
			.pipe(plugins.concat('_lib.js'))
			.pipe(plugins.ngAnnotate())
			.pipe(plugins.uglify())
			.pipe(gulp.dest(dest + opts.paths.jsDir));
});

gulp.task('concat-js:dist:app',function(){

	var dest = process.env.buildDirectory || opts.paths.tmp;

	return gulp.src(opts.paths.src + opts.paths.modulesDir + '/!**!/!*.js')
			.pipe(plugins.concat('app.js'))
			.pipe(plugins.ngAnnotate())
			.pipe(plugins.uglify())
			.pipe(gulp.dest(dest + opts.paths.jsDir));
});*/

gulp.task('concat-js:dev', gulp.parallel(
		function(done){
			utils.logMsg('\n*****' + 'begin concat-js' + '*****\n');
			done();
		},
		'concat-js:dev:lib',
		'concat-js:dev:app'
));

