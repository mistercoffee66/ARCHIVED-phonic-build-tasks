var gutil = require('gulp-util');

module.exports = {
	logImportant: function(msg) {
		gutil.log(gutil.colors.yellow('\n\n*\\o/* ' + msg + '\n'));
	},
	logMsg: function(msg) {
		gutil.log(gutil.colors.cyan('\t' + msg));
	},
	logErr: function(err) {
		gutil.log(gutil.colors.bgRed(err));
	}
};
