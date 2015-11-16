var gutil = require('gulp-util');

module.exports = {
	logMsg: function(msg) {
		gutil.log(gutil.colors.cyan(msg));
	},
	logErr: function(err) {
		gutil.log(gutil.colors.red(err));
	}
};
