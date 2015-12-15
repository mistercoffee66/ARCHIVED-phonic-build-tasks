/**
 * write config data to src/js/environment-config.js
 */

var gulp = require('gulp'),
	//opts = require('../opts'),
	packages = require('../packages'),
	plugins = require('../plugins'),
	utils = require('../utils');

gulp.task('app-config', function(done){

	utils.logImportant('begin app-config');

	var opts = require('../opts'); //load this here so it's not cached

	var dest = process.env.buildDirectory || opts.paths.tmp;

	var str = '//auto-generated by gulp from config.js\n';
	str += 'App.constant("environment", ' + JSON.stringify(opts.config) + ');';
	opts.fs.outputFile(dest + opts.paths.jsDir + '/app/environment-config.js', str, function(err){
		if(err) throw err;
		utils.logMsg('config file write completed');
		done();
	});
});