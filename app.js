var express = require('express'),
	app 	= express(),
	server 	= require('http').Server(app),
	fs		= require('fs'),
	stylus 	= require('stylus'),
	nib		= require('nib'),
	io 		= require('socket.io')(server),
	port 	= 3000,
	dir 	= "server";

app.listen(port, function  () {
	console.log("\nStarting server on port " + port + "\n");
});

io.listen(4000);
app.set('views', dir + '/../client');
app.set('view engine', 'jade');

app.use(stylus.middleware(dir + '/../client/public'));
app.use(stylus.middleware({src: dir + '/../client/public/style', }));
app.use(express.static(dir + '/../client/public'));


// IoC Container
var IoC = require(dir + '/lib/ioc.js');

// Base class for all classes to inherit from
var base = require(dir + '/lib/base.js');

// Manager
var manager = require(dir + '/lib/manager.js');

// config
var config = require(dir + '/app/config/config.js');
var ConfigClass = require(dir + '/lib/config.js').init(config);
var settings = require(dir + '/app/config/settings.js');

// Inherited Modules
var inheritedModules = fs.readdirSync(dir + '/lib/inherited_modules');


// Init Base
base.initConfig(base._inherit(ConfigClass.config));


manager.collectDependencies(dir, settings);
manager.buildClasses(base, ConfigClass, inheritedModules)



// Register all dependencies from classes directory
IoC.registerDependencies(manager.modules, io);


manager.initClasses(IoC);
manager.readyClasses();

// Setup routes
require(dir + '/lib/routes.js')(dir, app, manager.modules, port);
