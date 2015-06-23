var system = require('system'),
	page = require('webpage').create(),
	fs = require('fs'),
	config = require('./config'),
	dir = '_tmp-noscript/',
	env, host, body, fileName, text, ready, t, c, i= 0, path;

if (system.args[1] === 'stage') {
	page.settings.userName = 'ogilvy';
	page.settings.password = 'd1g1t@l';
	env = 'stage';
}
else {
	env = 'prod'
}

if (system.args[2] && system.args[2].length > 0) {
	fileName = system.args[2];
	path = system.args[2] === '/' ? '' : '/' + system.args[2];
}
else {
	console.log('[phantomjs log]' + ' ' + 'No path supplied!');
	phantom.exit();
}

host = config.siteUrl[env];
getHtml();

function getHtml() {

	//var c = 0;
	var ready = false;

	page.open(host + path, function() {

		t = setInterval(function(){

			ready = page.evaluate(function(){
				return document.getElementById('layout') !== null;
			});

			//console.log(ready);

			if (ready) {
				clearInterval(t);
				body = page.evaluate(function() {
					return document.getElementById('ibm-content-main');
				});
				text = body.innerHTML.replace(/<script[^>]*>([\s\S]*?)<\/script>/gm,'');
				console.log(text);
				phantom.exit();
			}
			else {
				console.log('[phantomjs log]' + ' ' + fileName + ' page timeout, page not executing properly or can\'t find #layout, exiting incomplete... \n');
				clearInterval(t);
				phantom.exit();
			}

		}, 5000);
	});
}