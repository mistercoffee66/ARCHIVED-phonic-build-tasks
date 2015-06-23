/**
 * save data from staging into local project and format it nice 'n pretty
 */
var gulp = require('gulp'),
	opts = require('../opts'),
	_ = require('lodash');

gulp.task('generate-pages', function(done){
	opts.logMsg('\n*****' + 'begin generate-PAGES task' + '*****\n');

	var PAGES = ['/'];//this array represents all the desired index PAGES, starting w the homepage

	getSitenav(function(data){
		getPagesList(data.items[0]);
		cleanPages(function(){
			createPages(function(){
				done();
			});
		});
	});

	function getSitenav(cb) {

		opts.fs.readFile(opts.src + '/json/sitenav.json', {encoding: 'utf8'}, function(err, data){
			if (err) throw err;
			cb(JSON.parse(data));
		});
	}


	//remove existing index PAGES
	function cleanPages(cb) {

		opts.logMsg('deleting previous index files');

			opts.packages.nodeDir.subdirs(opts.src, function(err,subdirs){ //get all directories

				if (err) throw err;

				var i = 0;

				subdirs.reverse(); //want to check inner directories first

				//console.log(subdirs);

				deleteEmpty();

				function deleteEmpty() {
					var dir = subdirs[i];
					//opts.logMsg(dir);
					opts.fs.readdir(dir, function(err,files) {

						if (err) throw err;

						if (files.length < 1 || (files.length === 1 && files[0] === 'index.html')) {

							opts.packages.del(dir,function(){
								i++;
								if (i === subdirs.length) {
									cb();
								}
								else {
									deleteEmpty();
								}
							});
						}
						else {
							i++;
							if (i === subdirs.length) {
								cb();
							}
							else {
								deleteEmpty();
							}
						}
					});
				}
			});


	}

	function getPagesList(item) {

		if (item.children && item.children.length > 0) {
			for (var i = 0; i < item.children.length; i++) {
				if (!item.children[i].section_only || item.children[i].section_only !== 'true') {
					PAGES.push(item.children[i].url);
				}
				getPagesList(item.children[i]); //recursive for children of children
			}
		}
	}

	function createPages(cb) {

		var template = opts.fs.readFileSync(opts.path.join(__dirname,'../index_template.html'), {encoding: 'utf8'}).toString(),
			compiled;

		compiled = _.template(template);

		for (var i= 0; i < PAGES.length; i++) {

			var path, file, level, relpath, contents;

			path = PAGES[i];

			if (path === '/') {
				file = opts.src + '/index.html';
			}
			else {
				file = opts.src + '/' + path+ 'index.html';
			}

			level = path === '/' ? 0 : (path.split('/')).length - 1;
			relpath = function() {
				var str = '';
				for (var i=0;i < level; i++) {
					str += '../';
				}
				return str;
			};

			contents = compiled({
				generatePage: {
					path: path,
					relpath: relpath(),
					page_title: '\<%= pageData.page_title %\>',
					page_description: '\<%= pageData.page_description %\>',
					page_keywords: '\<%= pageData.page_keywords %\>',
					og_title: '\<%= pageData.og_title %\>',
					og_description: '\<%= pageData.og_description %\>',
					site_nav_label: '\<%= pageData.site_nav_label %\>'
				}
			});

			opts.fs.outputFileSync(file, contents);
			opts.logMsg('html file saved: ' + file);
		}

		cb();

	}




});