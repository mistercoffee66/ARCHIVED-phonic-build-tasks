/**
 * generate an index.html for each page based on the site map
 */
var gulp = require('gulp'),
		opts = require('../opts'),
		packages = require('../packages'),
		plugins = require('../plugins'),
		utils = require('../utils'),
		_ = packages.lodash;

gulp.task('generate-pages', function(done){
	utils.logMsg('\n*****' + 'begin generate-pages task' + '*****\n');

	var dest = process.env.buildDirectory || opts.paths.tmp,
			PAGES = ['/'];//this array represents all the desired index PAGES, starting w the homepage


	getSitenav(function(data){
		getPagesList(data.items[0]);
		cleanPages(function(){
			createPages(function(){
				done();
			});
		});
	});

	/**
	 * get sitenav data
	 * @param cb
	 */
	function getSitenav(cb) {

		opts.fs.readFile(dest + '/json/sitenav.json', {encoding: 'utf8'}, function(err, data){
			if (err) throw err;
			cb(JSON.parse(data));
		});
	}


	//remove existing index PAGES
	function cleanPages(cb) {

		utils.logMsg('deleting previous index files');

		packages.nodeDir.subdirs(dest, function(err,subdirs){ //get all directories

			if (err) throw err;

			var i = 0;

			subdirs.reverse(); //want to check inner directories first

			//console.log(subdirs);

			deleteEmpty();

			function deleteEmpty() {
				var dir = subdirs[i];
				//utils.logMsg(dir);
				opts.fs.readdir(dir, function(err,files) {

					if (err) throw err;

					if (files.length < 1 || (files.length === 1 && files[0] === 'index.html')) {

						opts.fs.remove(dir,function(){
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

	/**
	 * figure out top-level and sub-level pages to get site structure
	 * @param item object from sitenav that contains all the stuff we want
	 */
	function getPagesList(item) {

		if (item.children && item.children.length > 0) {
			for (var i = 0; i < item.children.length; i++) {
				if (!item.children[i].section_only || item.children[i].section_only !== 'true') {
					PAGES.push(item.children[i].url);
				}
				getPagesList(item.children[i]); //recursive for children of children
				//TODO: refactor to allow for infinite levels of children
			}
		}
	}

	/**
	 * generate the pages from a template
	 * @param cb
	 */
	function createPages(cb) {

		var template_file = './index_template.html',
				template_file_default = opts.path.join(__dirname,'../index_template.html'),
				template, compiled;

		utils.logMsg('using template ' + template_file);

		try {
			template = opts.fs.readFileSync(template_file, {encoding: 'utf8'}).toString();
		}
		catch(err) {
			utils.logErr('Project-specific template not found at ' + template_file);
			utils.logMsg('using default template ' + template_file_default + '\n');

			try {
				template = opts.fs.readFileSync(template_file_default, {encoding: 'utf8'}).toString();
			}
			catch(err) {
				utils.logErr(err);
			}
		}

		compiled = _.template(template);

		for (var i= 0; i < PAGES.length; i++) {

			var path, file, level, relpath, contents;

			path = PAGES[i];

			if (path === '/') {
				file = dest + '/index.html';
			}
			else {
				file = dest + '/' + path+ 'index.html';
			}

			level = path === '/' ? 0 : (path.split('/')).length - 1;
			relpath = function() {
				var str = '';
				for (var i=0;i < level; i++) {
					str += '../';
				}
				return str;
			};

			// populate some stuff in each page
			contents = compiled({
				generatePage: {
					path: path,
					relpath: relpath(),
					page_title: '\<%= pageData.page_title %\>', // this means it will get compiled with page-level data in the dist build
					page_description: '\<%= pageData.page_description %\>',
					page_keywords: '\<%= pageData.page_keywords %\>',
					og_title: '\<%= pageData.og_title %\>',
					og_description: '\<%= pageData.og_description %\>',
					site_nav_label: '\<%= pageData.site_nav_label %\>',
					canonical_url: '\<%= pageData.canonical_url %\>'
				}
			});

			opts.fs.outputFileSync(file, contents);
			utils.logMsg('html file saved: ' + file);
		}

		cb();

	}




});