# phonic-build-tasks
v2.0.0 for IBM v18

# Phonic v18 Site development info

1. [Quick Start](#Quick-start)
2. [Differences from Phonic for v17(e) tasks](#Differences)
3. [Directory structure](#Directory-structure)

<a id="Quick-start"></a>
## Quick start

### Install system dependencies globally if you don't have them
* [Nodejs](https://nodejs.org/)
* [npm](https://github.com/npm/npm)
* [Bower](http://bower.io/)
* [Gulp](http://gulpjs.com/)
* [PhantomJS](http://phantomjs.org/) (only needed if you run a [build for deployment](#build-for-deployment) )

### Get project dependencies

    $ cd path_to_site/SourceCode
    $ npm install
    $ bower install

If you get errors on npm install, delete the `node_modules` directory in the project, run:

	$ ulimit -n 2048
	$ npm install

### Setup

	$ npm run gulp setup

### Develop

	$ npm run gulp
	
### Build

    $ npm run gulp dist

<a id="Differences"></a>
## Differences from Phonic for v17(e) tasks

### Gulp version

* v17(e) sites have been using Gulp v3.x. v18 uses [Gulp v4.x](https://github.com/gulpjs/gulp/tree/4.0), which is __not backwards-compatible__.
* Phonic for v18 assumes your global system Gulp is v3.x and you want to keep it for ongoing v17(e) sites. When you run `npm install` for v18, it installs a local Gulp v4.x in your project folder. The command `npm run gulp` is aliased to run that local Gulp version.

### Root directories

* `src/` contains only uncompiled files that we manually add/edit -- no generated files like css, index.html, libraries installed via bower.
* `tmp/` is a temporary directory for your local server to point to; everything there is generated and/or compiled by Gulp tasks. __Don't check this directory into git ;)__

### Top-level $scope

* `$scope.siteData` has all the site-wide properties as defined in the sitenav.json (replcaes v17(e) `$scope.metadata`).
* `$scope.pageData` has all the page-specific properties as defined in the page's index.json (replcaes v17(e) `$scope.meta`).

Example:

    <!-- my-template.html -->
    <div>The locale for the entire site is {{siteData.locale}}</div>
    <div>This page's keywords are {{pageData.page_keywords}}</div>

### Links

You can use the following syntax for any links:
    
    <a ng-href="{{utils.processLink(item.some_link_url)}}">{{item.some_link_text}}</a>

For internal links, this will prepend the correct relative path and append the current querystring. It will leave external links alone. If you also want to set `target="_blank"` for external links, you can do this:
    
    <a ng-href="{{utils.processLink(item.some_url)}} target="{{utils.getTarget(item.some_url)}}">{{item.some_link_text}}</a>
    
This will set the target as "_blank" for external or "_self" for internal links.

### Not mobile-first

IBM's v18 css isn't mobile-first, and with continued IE8 support it's no longer worth the effort for our less to be mobile-first.

### Breakpoints

IBM's v18 css has many breakpoints, some adaptive and some responsive, they aren't documented, and they're subject to change.
 
### Debugging
 
`console.log()` is disabled when the environment is 'prod' as defined in `./config.js`. To enable logging in prod, use the querystring `debug=true` with the prod url in the browser. 


<a id="Directory-structure"></a>
## Directory structure

    ├── README.md
    ├── bower.json
    ├── config.js
    ├── gulpfile.js -> bower_components/phonic-build-tasks/gulpfile.js //symlink
    ├── index_template.html //override default template
    ├── package.json
    ├── src // all edits go here for check-in to git
    │   ├── img
    │   │   ├── video
    │   │   │   ├── ...
    │   │   ├── watson_1x.png
    │   │   └── watson_analytics_1x.png
    │   ├── static-assets
    │   │   ├── fonts
    │   │   │   ├── ...
    │   │   ├── video
    │   │   └── pdf
    │   ├── js
    │   │   ├── _lib // any libraries that aren't managed by bower can go here
    │   │   │   └── __xHook.js
    │   │   ├── app.js
    │   │   ├── controllers
    │   │   │   └── main.js
    │   │   ├── filters
    │   │   │   ├── exclude-nav-item.js
    │   │   │   └── filters.js
    │   │   └── services
    │   │       ├── data-service.js
    │   │       ├── ...
    │   ├── less
    │   │   ├── _lib
    │   │   │   └── lesshat.less
    │   │   ├── main.less // auto populates any imports from modules/ below
    │   │   └── vars.less
    │   └── modules // all content types and directives
    │       ├── get-template
    │       │   ├── 404.html
    │       │   └── get-template.js
    │       ├── layout
    │       │   ├── layout.html
    │       │   └── layout.js
    │       ├── leadspace
    │       │   └── leadspace.html
    │       ├── sample
    │       │   ├── sample.html
    │       │   ├── sample.js
    │       │   └── sample.less
    └── tmp // local dev server points here, never checked in to git
        ├── img
        ├── static-assets
        ├── css
        │   ├── main.css
        │   └── main.css.map
        ├── index.html
        ├── js
        │   ├── _lib.min.js
        │   ├── _lib.min.js.map
        │   ├── app.min.js
        │   └── app.min.js.map
        ├── json
        │   ├── index.json
        │   ├── some-subpage
                ├── index.json
        │   └── sitenav.json
        └── some-subpage
            ├── index.html



