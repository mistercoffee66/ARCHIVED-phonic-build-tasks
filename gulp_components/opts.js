module.exports = {
	//argv: require('yargs')().argv,
	fs: require('fs-extra'),
	path: require('path'),
	Promise: require("bluebird"),
	paths: {
		src: './src',
		tmp: './tmp',
		dist: './dist',
		cssDir: '/css',
		imgDir: '/i',
		jsDir: '/js',
		jsonDir: '/json',
		lessDir : ['/less'],
		homepage: '/index.html',
		categoryPages: '/*/**/index.html',
		ngTemplates: '/templates/**/*.html',
		staticAssets : ['/**/*.{css,map,woff,eot,ttf,json,gif}']
	},
	config: require(process.cwd() + '/config')
};
