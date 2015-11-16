/**
 * make concated lib files based on bower dev dependencies
 */

var gulp = require('gulp'),
		opts = require('../opts'),
		packages = require('../packages'),
		plugins = require('../plugins'),
		utils = require('../utils');

gulp.task('wiredep', function() {

	utils.logMsg('\n*****' + 'begin wiredep task' + '*****\n');

	var dest = process.env.buildDirectory;

	var files = [],
		l;

	l = packages.mainBowerFiles('**/*.js').length;

	for (var i = 0; i < l; i++) {
		if (packages.mainBowerFiles('**/*.js')[i].indexOf('/jquery.js') < 0) {
			files.push(packages.mainBowerFiles('**/*.js')[i]);
		}
	}

	return gulp.src(files)
		.pipe(plugins.ngAnnotate())
		.pipe(plugins.uglify())
		.pipe(plugins.concat('_lib.js'))
		.pipe(gulp.dest(dest + opts.paths.jsDir));
});