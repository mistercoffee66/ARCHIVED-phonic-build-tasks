//optional, has other sys dependencies

var gulp = require('gulp'),
	opts = require('../opts');

gulp.task('sprite', function () {
	var spriteData = gulp.src(opts.src + '/img/sprite-src/*.png')
		.pipe(opts.packages['gulp.spritesmith']({
		imgName: 'sprite.png',
		imgPath: 'sprite.png',
		cssName: 'sprite.less',
		cssFormat: 'less'
	}));
	spriteData.css.pipe(gulp.dest(opts.src + '/styles/less'));
	spriteData.img.pipe(gulp.dest(opts.src + '/styles'));

});