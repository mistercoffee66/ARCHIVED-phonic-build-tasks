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

	//paths = ['home','cloud', 'watson', 'data', 'social', 'security', 'tv-ads']; //add/remove as needed to match subpage directories

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
		command = 'phantomjs seo.js ' + env + ' ' + page;
		exec(command, function(error, stdout, stderr){
			if (stdout.indexOf('[phantomjs log]') === 0) {
				opts.logMsg(stdout);
			}
			else {
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

		opts.logMsg('injecting seo into ' + destDir + 'index.html...');

		gulp.src(destDir + 'index.html')
			.pipe(opts.plugins.replace(/<noscript.id="seo"[^>]*>([\s\S]*?)<\/noscript>/gm,'')) //remove any previous instances of noscript block
			.pipe(opts.plugins.injectString.before('</body>', '<noscript id="seo">'+ contents + '</noscript>'))
			.pipe(gulp.dest(destDir));
	}
});




//supporting task, minifies the txt files in _tmp-noscript
gulp.task('minifySeo',function(){

	opts.logMsg('minifying tmp seo files...');

	return gulp.src(['./_tmp-noscript/*.*'])
			.pipe(opts.plugins.htmlmin({
				removeComments: true,
				collapseWhitespace: true
			}))
			.pipe(gulp.dest('_tmp-noscript'));
});

//supporting task, injects the txt files from _tmp-noscript into the dist index.htmls
gulp.task('injectSeo', function () {

	opts.logMsg('injecting seo into html...');

	return gulp.src(['./_tmp-noscript/*.*']) //get the files
			.pipe(opts.plugins.tap(function(file, t){

				var destDir = '/' + (opts.path.basename(file.path, '.txt') === 'home' ? '' : opts.path.basename(file.path, '.txt') + '/');

				//copyContent(destDir, file.contents);
				opts.logMsg('injecting seo into ' + opts.dist + destDir + 'index.html');
				return gulp.src(opts.dist + destDir + 'index.html')
						.pipe(opts.plugins.replace(/<noscript.id="seo"[^>]*>([\s\S]*?)<\/noscript>/gm,'')) //remove any previous instances of noscript block
						.pipe(opts.plugins.injectString.before('</body>', '<noscript id="seo">'+ file.contents + '</noscript>'))
						.pipe(gulp.dest(opts.dist + destDir));
			}));

/*	function copyContent(destDir, contents) {
		opts.logMsg('injecting seo into ' + opts.dist + destDir + 'index.html');
		gulp.src(opts.dist + destDir + 'index.html')
				.pipe(opts.plugins.replace(/<noscript.id="seo"[^>]*>([\s\S]*?)<\/noscript>/gm,'')) //remove any previous instances of noscript block
				.pipe(opts.plugins.injectString.before('</body>', '<noscript id="seo">'+ contents + '</noscript>'))
				.pipe(gulp.dest(opts.dist + destDir));
	}*/
});