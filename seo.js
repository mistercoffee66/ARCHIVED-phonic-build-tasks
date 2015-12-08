var system = require('system'),
		page = require('webpage').create(),
		fs = require('fs'),
		//config = require('../../config'),
		host, body, fileName, text, ready, t, path;

if (system.args[1] && system.args[2]) {
	host = system.args[1];
	fileName = system.args[2];
	path = system.args[2] === '/' ? '' : '/' + system.args[2];
	getHtml();
}
else {
	console.log('[phantomjs log]' + ' ' + 'No path supplied!');
	phantom.exit();
}


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
					return document.getElementById('layout');
				});
				text = body.innerHTML.replace(/<script[^>]*>([\s\S]*?)<\/script>/gm,'');

				if (text.length < 1) {
					console.log('[phantomjs log]' + ' ' + 'Scrape empty!');
				}

				else {
					console.log(text);
				}

				phantom.exit();
			}
			else {
				console.log('[phantomjs log]' + ' ' + host + path + ' page timeout, page not executing properly or can\'t find #layout, exiting incomplete... \n');
				clearInterval(t);
				phantom.exit();
			}

		}, 5000);
	});
}