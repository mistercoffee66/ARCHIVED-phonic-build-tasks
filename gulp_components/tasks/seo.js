/**
 * run the site in phantomjs, scrape the content, insert it into noscript tags
 */

var gulp = require('gulp'),
		opts = require('../opts');

//main task in this sequence
gulp.task('seo',function(done){

	opts.logMsg('\n*****' + 'begin seo task' + '*****\n');

	var sys = require('sys'),
			exec = require('child_process').exec,
			args = opts.packages.yargs.argv,
			PAGES = ['/'],
			command, env,
			i= 0;

	getSitenav(function(data){

		getPagesList(data.items[0]);
		opts.logMsg('starting seo scraping...');
		env = args.stage ? 'stage' : 'prod';
		runPhantom(PAGES[i]);
	});


	function getSitenav(cb) {

		opts.fs.readFile(opts.src + '/json/sitenav.json', {encoding: 'utf8'}, function(err, data){
			if (err) throw err;
			cb(JSON.parse(data));
		});
	}

	function getPagesList(item) {

		if (item.children && item.children.length > 0) {
			for (var i = 0; i < item.children.length; i++) {
				if (!item.children[i].section_only || item.children[i].section_only === 'false') {
					PAGES.push(item.children[i].url);
				}
				getPagesList(item.children[i]); //recursive for children of children
			}
		}
	}

	function runPhantom(page) {

		opts.logMsg('scraping ' + page + '...allowing 5s for it load...');
		command = 'phantomjs ./bower_components/phonic-build-tasks/seo.js ' + env + ' ' + page;
		exec(command, function(error, stdout, stderr){
			if (stdout.indexOf('[phantomjs log]') === 0) {
				opts.logMsg('************ ERROR: ' + stdout);
			}
			else {
//				console.log(stdout);
				injectSeo(page, stdout);
				i++;

				if (i < PAGES.length) {
					runPhantom(PAGES[i]);
				}
				else {
					opts.logMsg('scraping complete\n');
					done();
				}
			}
		});
	}

	function injectSeo(path, contents) {
		var destDir;

		if (path === '/') {
			destDir = opts.dist + path;;
		}
		else {
			destDir = opts.dist + '/' + path;
		}

		contents = opts.packages.htmlmin(contents, {
			removeComments: true,
			collapseWhitespace: true
		});

		//console.log(contents);

		opts.logMsg('injecting seo into ' + destDir + 'index.html...');

		gulp.src(destDir + 'index.html')
<<<<<<< HEAD
				.pipe(opts.plugins.replace(/<noscript.id="seo"[^>]*>([\s\S]*?)<\/noscript>/gm,'')) //remove any previous instances of noscript block
				.pipe(opts.plugins.injectString.before('<div id="ibm-footer">', '<noscript id="seo">'+ contents + '</noscript>\n'))
				.pipe(gulp.dest(destDir));
=======
			.pipe(opts.plugins.replace(/<noscript.id="seo"[^>]*>([\s\S]*?)<\/noscript>/gm,'')) //remove any previous instances of noscript block
			.pipe(opts.plugins.injectString.before('<div id="ibm-footer">', '<noscript id="seo">'+ contents + '</noscript>\n'))
			.pipe(gulp.dest(destDir));
>>>>>>> e35cd26036073f23176f164e9161b8d633705958
	}
});
