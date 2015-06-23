/**
 * prevents gulp from exiting on stream errs
 * https://github.com/gulpjs/gulp/issues/71
 */
module.exports = (function(){
	var gulp = require('gulp'),
		origSrc = gulp.src,
		opts = require('./opts');

	gulp.src = function () {
		return fixPipe(origSrc.apply(this, arguments));
	};

	function fixPipe(stream) {
		var origPipe = stream.pipe;
		stream.pipe = function (dest) {
			arguments[0] = dest.on('error', function (error) {
				var nextStreams = dest._nextStreams;
				if (nextStreams) {
					nextStreams.forEach(function (nextStream) {
						nextStream.emit('error', error);
						opts.getProjectTitle(function(title) {
							opts.packages.nodeNotifier.notify({
								'title': 'Gulp project' + title,
								'message': error
							});
						});
					});
				} else if (dest.listeners('error').length === 1) {
					throw error;
				}
			});
			var nextStream = fixPipe(origPipe.apply(this, arguments));
			(this._nextStreams || (this._nextStreams = [])).push(nextStream);
			return nextStream;
		};
		return stream;
	}
})();