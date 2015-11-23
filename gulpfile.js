var gulp = require('gulp'),
		opts = require('./gulp_components/opts'),
		packages = require('./gulp_components/packages'),
		plugins = require('./gulp_components/plugins'),
		utils = require('./gulp_components/utils');

packages.requireDir(__dirname + '/gulp_components/tasks');

gulp.task('setup', gulp.series(
		'set-build-directory:dev',
		'get-json',
		'generate-pages'
));

gulp.task('dev', gulp.series(
		'set-build-directory:dev',
		gulp.parallel(
				'app-config',
				'wiredep',
				'ng-templates'
		),
		gulp.parallel(
				'concat-js:dev',
				'less:dev',
				'images:dev',
				'static-assets'
		),
		'serve'
));

gulp.task('dist', gulp.series(
		'set-build-directory:dist',
		'get-json',
		'generate-pages',
		gulp.parallel(
				'app-config',
				'wiredep',
				'ng-templates'
		),
		gulp.parallel(
				'concat-js:dist',
				'less:dist',
				'images:dist',
				'static-assets'
		),
		'serve'
		//,'seo'
));

gulp.task('default',gulp.series('dev'));

