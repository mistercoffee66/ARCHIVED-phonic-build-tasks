var gulp = require('gulp'),
	opts = require('../opts');

gulp.task('set-build-directory:dev', function(done){
	process.env.buildDirectory = opts.paths.tmp;
	done();
});

gulp.task('set-build-directory:dist', function(done){
	process.env.buildDirectory = opts.paths.dist;
	done();
});