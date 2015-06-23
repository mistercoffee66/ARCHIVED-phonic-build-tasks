/**
 * watch for filesystem changes and do stuff on change
 */

var gulp = require('gulp'),
	opts = require('../opts');



gulp.task('watch', function() {

	opts.logMsg('\n*****' + 'begin watch task' + '*****\n');
	opts.getProjectTitle(function(title){
		opts.plugins.livereload.listen();
		opts.packages.nodeNotifier.notify({
			'title': 'Gulp project' + title,
			'message': 'livereload listening'
		});
		gulp.watch(opts.src + opts.cssDir + '/**/*.less', ['less']);
		gulp.watch(opts.src + opts.cssDir + '/**/*.less', ['lessIE']);
		gulp.watch(opts.src + opts.ngTemplates, ['ng-templates']);
		gulp.watch(opts.src + opts.jsDir + '/**/*.js', ['injectjsDev']);
		gulp.watch([opts.src + opts.homepage, opts.src + opts.categoryPages,opts.src + opts.cssDir + '/**/*.css']).on('change', opts.plugins.livereload.changed);
	});
});