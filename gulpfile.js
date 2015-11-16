var gulp = require('gulp'),
	opts = require('./gulp_components/opts'),
	packages = require('./gulp_components/packages'),
	plugins = require('./gulp_components/plugins'),
	utils = require('./gulp_components/utils');

packages.requireDir(__dirname + '/gulp_components/tasks');

gulp.task('log1', function(done){
	console.log('logging!');
	console.log(process.cwd());
	done();
});

gulp.task('dev', gulp.series(
		'wiredep'
));

gulp.task('setup', gulp.series(
		'set-build-directory:dev',
		'app-config',
		'get-json',
		'generate-pages'
));


