/**
 * save data from staging into local project and format it nice 'n pretty
 */
var gulp = require('gulp'),
		opts = require('../opts'),
		packages = require('../packages'),
		plugins = require('../plugins'),
		utils = require('../utils');

gulp.task('get-json', function(done){

	utils.logMsg('\n*****' + 'begin get-json:dev task' + '*****\n');
	utils.logMsg('datahost = ' + host);

	var dest = process.env.buildDirectory || opts.paths.tmp,
			PAGES = ['/'],//this array represents all the desired json files, starting w the homepage
			complete = -1,
			jsonDir, host, protocol;

	host = opts.config.dataHost.stage;
	protocol = host.indexOf('https') > -1 ? require('https') : require('http');
	jsonDir = dest + opts.paths.jsonDir + '/';

	//remove existing json subdirectories
	opts.fs.remove(jsonDir + '/**/index.json');

	//get the sitenav data first
	doRequest(host + '/sitenav_' + opts.config.localeStr, 'sitenav', function(data){

		if (!data.items || data.items.length < 1) {
			utils.logErr('no pages defined in sitenav data!');
			return false;
		}

		//get a list of all pages
		getPagesList(data.items[0], function(){

			for (var j = 0; j < PAGES.length; j++) {

				//get json for each page
				doRequest(host + '/_design/site/_view/by_url?key=["'+ (j === 0 ? '/' : PAGES[j]) + '","' + opts.config.localeStr + '"]&include_docs=true', PAGES[j], function(data){

					if (complete === (PAGES.length)) {
						done();
					}
				});
			}
		});
	});

	/**
	 * get json from api and save to filesystem
	 * @param dataUrl
	 * @param page
	 * @param cb
	 */
	function doRequest(dataUrl, page, cb) {

		var outputPath;

		if (page === 'sitenav') {
			outputPath = jsonDir + 'sitenav.json'
		}
		else if (page === '/') {
			outputPath = jsonDir + 'index.json';
		}
		else {
			outputPath = jsonDir + page + 'index.json';
		}

		utils.logMsg('getting json from : ' + dataUrl);


		protocol.get(dataUrl, function(res){
			var body = '', data;

			res.on('data', function(chunk){
				body += chunk;
			});

			res.on('end', function(){

				if (res.statusCode == 200) {

					try {
						data  = JSON.parse(body);
					} catch (e) {
						utils.logErr('json parse error: ' + e);
					}

					opts.fs.outputJSON(outputPath,data);

					utils.logMsg('json file saved: ' + outputPath);
					complete++;
					if (cb) {
						cb(data);
					}
				}

				else {
					utils.logErr('json request responded with error code ' + res.statusCode);
				}

			}).on('error', function(e) {
						utils.logErr('error getting json for ' + host + dataUrl + ': ', e);
					});
		});

	}

	/**
	 * figure out top-level and sub-level pages to get site structure and return a flat array of all pages
	 * @param item object from sitenav that contains all the stuff we want
	 * @param cb
	 */
	function getPagesList(item, cb) {

		//get an item's children and put them in PAGES array

		if (item.children && item.children.length > 0) {
			for (var i = 0; i < item.children.length; i++) {
				if (!item.children[i].section_only || item.children[i].section_only === 'false') {
					PAGES.push(item.children[i].url);
				}
				getPagesList(item.children[i]); //recursive for children of children
			}
		}

		if (cb) {
			cb();
		}

	}
});

