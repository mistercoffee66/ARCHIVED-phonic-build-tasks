/**
 * generate an index.html for each page based on the site map and populate it w metadata
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
			PAGES = ['/'],//this array represents all the desired json files, starting w the homepage
			complete = 0,
			siteData, template;

	host = opts.config.dataHost.stage;
	protocol = host.indexOf('https') > -1 ? require('https') : require('http');

	//remove existing index.htmls
	opts.fs.remove(dest + '/**/index.html', function(){
		//get the sitenav data first
		getJSON(dest + opts.paths.jsonDir + '/sitenav.json', function(data){

			siteData = data;

			if (!data.items || data.items.length < 1) {
				utils.logErr('no pages defined in sitenav data!');
				return false;
			}

			//get a list of all pages
			getPagesList(data.items[0], function(){
				getTemplate(function(){
					//make all the pages from a template
					for (var j = 0; j < PAGES.length; j++) {
						createPage(PAGES[j], function(){
							if (complete === (PAGES.length)) {
								done();
							}
						});
					}
				});
			});
		});
	});





	/**
	 * get data from json
	 * @param cb
	 * @param path
	 */
	function getJSON(path, cb) {

		opts.fs.readFile(path, {encoding: 'utf8'}, function(err, data){
			if (err) throw err;
			cb(JSON.parse(data));
		});
	}

	function getTemplate(cb) {

		var template_file = './index_template.html',
			template_file_default = opts.path.join(__dirname,'../index_template.html');

		utils.logMsg('using template ' + template_file);

		try {
			template = opts.fs.readFileSync(template_file, {encoding: 'utf8'}).toString();
			cb();
		}
		catch(err) {
			utils.logErr('Project-specific template not found at ' + template_file);
			utils.logMsg('using default template ' + template_file_default + '\n');

			try {
				template = opts.fs.readFileSync(template_file_default, {encoding: 'utf8'}).toString();
				cb();
			}
			catch(err) {
				utils.logErr(err);
			}
		}
	}

	/**
	 * generate the pages from a template
	 * @param cb
	 */
	function createPage(page,cb) {

		var compiled = _.template(template),
			outputPath;

		if (page === '/') {
			outputPath = '/index';
		}
		else {
			outputPath = '/' + page + 'index';
		}

		getJSON(dest + opts.paths.jsonDir + outputPath + '.json', function(data){

			var file, level, relpath, contents, pageData;

			pageData = data.rows[0].doc;

			if (typeof pageData.chat_enabled === 'undefined' || pageData.chat_enabled !== 'true' ) {
				pageData.chat_script = '';
			}

			file = dest + outputPath + '.html';
			level = outputPath === '/' ? 0 : (outputPath.split('/')).length - 1;
			relpath = function() {
				var str = '';
				for (var i=0;i < level; i++) {
					str += '../';
				}
				return str;
			};

			var reference = JSON.stringify({siteData: siteData, pageData: pageData});

			// populate some stuff in each page
			contents = compiled({
				generatePage: {
					path: outputPath,
					relpath: relpath(),
					pageData: pageData,
					siteData: siteData,
					reference_config: JSON.stringify({config: opts.config}),
					reference_siteData: JSON.stringify({siteData: siteData}),
					reference_pageData: JSON.stringify({pageData: pageData})
				}
			});

			opts.fs.outputFileSync(file, contents);
			utils.logMsg('html file saved: ' + file);

			complete++;
			cb();
		});

	}

	/**
	 * figure out top-level and sub-level pages to get site structure
	 * @param item object from sitenav that contains all the stuff we want
	 */
	function getPagesList(item, cb) {

		if (item.children && item.children.length > 0) {
			for (var i = 0; i < item.children.length; i++) {
				if (!item.children[i].section_only || item.children[i].section_only === 'false') {
					PAGES.push(item.children[i].url);
				}
				getPagesList(item.children[i]); //recursive for children of children
				//TODO: refactor to allow for infinite levels of children
			}
		}

		if (cb) {
			cb();
		}
	}
});