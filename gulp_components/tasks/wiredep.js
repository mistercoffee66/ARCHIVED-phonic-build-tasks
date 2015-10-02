/**
 * make concated lib files based on bower dev dependencies
 */

var gulp = require('gulp'),
	opts = require('../opts');

//optionally run this task to concat lib files from bower_components based on bower.json
gulp.task('wiredep', function() {

	opts.logMsg('\n*****' + 'begin wiredep task' + '*****\n');

	var bowerFiles = opts.packages.bowerFiles({dev: false});
	if (bowerFiles.js) {

		// strip out jquery 2.x bc IBM already includes 1.8x for IE8
		var l = bowerFiles.js.length,
				files = [];

		for (var i = 0; i < l; i++) {
			if (bowerFiles.js[i].indexOf('/jquery.js') < 0) {
				files.push(bowerFiles.js[i]);
			}
		}

		gulp.src(files)
			.pipe(opts.plugins.concat('_lib.js'))
			.pipe(gulp.dest(opts.src + opts.jsDir));
	}
});
