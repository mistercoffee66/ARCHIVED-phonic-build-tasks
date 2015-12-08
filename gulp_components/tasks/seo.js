/**
 * run the site in phantomjs, scrape the content, insert it into noscript tags
 */

var gulp = require('gulp'),
		opts = require('../opts'),
		packages = require('../packages'),
		plugins = require('../plugins'),
		utils = require('../utils');

//main task in this sequence
gulp.task('seo',function(done){

	utils.logImportant('begin seo task');

	var exec = require('child_process').exec,
		host = 'http://localhost:' + process.env.bsPort + '/',
		PAGES = ['/'],
		command,
		i= 0;

	getSitenav(function(data){

		getPagesList(data.items[0]);
		utils.logMsg(PAGES.length + ' pages to scrape');
		utils.logMsg('starting scraping');
		runPhantom(PAGES[i]);
	});


	function getSitenav(cb) {

		opts.fs.readFile(opts.paths.tmp + '/json/sitenav.json', {encoding: 'utf8'}, function(err, data){
			if (err) throw err;
			cb(JSON.parse(data));
		});
	}

	function getPagesList(item) {

		if (item.children && item.children.length > 0) {
			for (var i = 0; i < item.children.length; i++) {
				if (typeof item.children[i].section_only === 'undefined' || item.children[i].section_only === 'false' || !item.children[i].section_only) {
					PAGES.push(item.children[i].url);
				}
				getPagesList(item.children[i]); //recursive for children of children
			}
		}
	}

	function runPhantom(page) {

		utils.logMsg('scraping ' + page + ' ...Allowing 5s for it load... ');
		command = 'phantomjs bower_components/phonic-build-tasks/seo.js ' + host + ' ' + page;
		exec(command, {maxBuffer: 300*1024} ,function(error, stdout, stderr){
			if (stderr) {
				utils.logErr('ERROR: ' + stderr);
				done();
			}
			else if (stdout.indexOf('[phantomjs log]') === 0) {
				utils.logErr('ERROR: ' + stdout);
				done();
			}
			else {
				injectSeo(page, stdout);
				i++;

				if (i < PAGES.length) {
					runPhantom(PAGES[i]);
				}
				else {
					utils.logImportant('Scraping complete!');
					done();
				}
			}
		});
	}

	function injectSeo(path, contents) {
		var destDir;

		if (path === '/') {
			destDir = opts.paths.dist + path;
		}
		else {
			destDir = opts.paths.dist + '/' + path;
		}

		contents = packages.htmlmin(contents, {
			removeComments: true,
			collapseWhitespace: true
		});
		utils.logMsg('injecting seo into ' + destDir + 'index.html\n');
		//opts.logMsg(contents);

		gulp.src(destDir + 'index.html')
				.pipe(plugins.replace(/<noscript id="seo"[^>]*>([\s\S]*?)<\/noscript>/gm,'')) //remove any previous instances of noscript block
				.pipe(plugins.injectString.after('<div get-template="layout/layout" id="layout">', '<noscript id="seo">'+ contents + '</noscript>\n'))
				.pipe(gulp.dest(destDir));
	}
});